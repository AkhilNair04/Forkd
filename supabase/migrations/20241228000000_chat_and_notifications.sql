-- Create extension for UUID generation
create extension if not exists "uuid-ossp";

-- Users table (extend existing or create if not exists)
create table if not exists public.users (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  user_type text not null check (user_type in ('customer', 'chef')),
  name text not null,
  avatar text,
  phone text,
  location text,
  preferences jsonb default '{}',
  last_active_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- User push tokens table
create table public.user_push_tokens (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  push_token text not null,
  platform text not null check (platform in ('ios', 'android', 'web')),
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, push_token)
);

-- Chats table
create table public.chats (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references public.users(id) on delete cascade not null,
  chef_id uuid references public.users(id) on delete cascade not null,
  order_id uuid, -- references orders table if exists
  status text default 'active' check (status in ('active', 'archived', 'blocked')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  last_message_at timestamp with time zone default now(),
  unique(customer_id, chef_id, order_id)
);

-- Messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  chat_id uuid references public.chats(id) on delete cascade not null,
  sender_id uuid references public.users(id) on delete cascade not null,
  sender_type text not null check (sender_type in ('customer', 'chef', 'system')),
  message text not null,
  message_type text default 'text' check (message_type in ('text', 'order_update', 'system')),
  timestamp timestamp with time zone default now(),
  read boolean default false,
  edited_at timestamp with time zone,
  reply_to uuid references public.messages(id) on delete set null
);

-- Orders table (basic structure for notifications)
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references public.users(id) on delete cascade not null,
  chef_id uuid references public.users(id) on delete cascade not null,
  dish_name text not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  estimated_time text,
  total_amount decimal(10,2),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Promotional deals table
create table public.promotional_deals (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  discount_percentage integer,
  discount_amount decimal(10,2),
  promo_code text unique,
  chef_id uuid references public.users(id) on delete cascade,
  min_order_amount decimal(10,2),
  max_uses integer,
  current_uses integer default 0,
  valid_from timestamp with time zone default now(),
  valid_until timestamp with time zone not null,
  is_active boolean default true,
  target_audience text default 'all' check (target_audience in ('all', 'customers', 'new_users', 'inactive_users')),
  location text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Notification campaigns table (for tracking)
create table public.notification_campaigns (
  id uuid default uuid_generate_v4() primary key,
  type text not null check (type in ('promotional', 'order_update', 'chef_availability', 'weekly_deals')),
  title text not null,
  message text not null,
  target_audience text,
  sent_count integer default 0,
  success_count integer default 0,
  failure_count integer default 0,
  created_at timestamp with time zone default now()
);

-- User notification preferences table
create table public.user_notification_preferences (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null unique,
  order_updates boolean default true,
  new_messages boolean default true,
  promotional_notifications boolean default true,
  chef_availability_notifications boolean default true,
  weekly_deals boolean default true,
  push_notifications boolean default true,
  email_notifications boolean default false,
  sms_notifications boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for performance
create index idx_chats_customer_id on public.chats(customer_id);
create index idx_chats_chef_id on public.chats(chef_id);
create index idx_chats_last_message_at on public.chats(last_message_at desc);
create index idx_messages_chat_id on public.messages(chat_id);
create index idx_messages_timestamp on public.messages(timestamp desc);
create index idx_messages_read on public.messages(read) where read = false;
create index idx_user_push_tokens_user_id on public.user_push_tokens(user_id);
create index idx_user_push_tokens_active on public.user_push_tokens(is_active) where is_active = true;
create index idx_orders_status on public.orders(status);
create index idx_orders_customer_id on public.orders(customer_id);
create index idx_orders_chef_id on public.orders(chef_id);
create index idx_promotional_deals_active on public.promotional_deals(is_active, valid_until) where is_active = true;

-- Row Level Security (RLS) policies
alter table public.chats enable row level security;
alter table public.messages enable row level security;
alter table public.user_push_tokens enable row level security;
alter table public.orders enable row level security;
alter table public.user_notification_preferences enable row level security;

-- Chats policies
create policy "Users can view their own chats" on public.chats for select using (
  auth.uid() = customer_id or auth.uid() = chef_id
);

create policy "Users can create chats they participate in" on public.chats for insert with check (
  auth.uid() = customer_id or auth.uid() = chef_id
);

create policy "Users can update their own chats" on public.chats for update using (
  auth.uid() = customer_id or auth.uid() = chef_id
);

-- Messages policies
create policy "Users can view messages in their chats" on public.messages for select using (
  exists (
    select 1 from public.chats 
    where chats.id = messages.chat_id 
    and (chats.customer_id = auth.uid() or chats.chef_id = auth.uid())
  )
);

create policy "Users can send messages to their chats" on public.messages for insert with check (
  exists (
    select 1 from public.chats 
    where chats.id = messages.chat_id 
    and (chats.customer_id = auth.uid() or chats.chef_id = auth.uid())
  )
  and auth.uid() = sender_id
);

create policy "Users can update their own messages" on public.messages for update using (
  auth.uid() = sender_id
);

-- Push tokens policies
create policy "Users can manage their own push tokens" on public.user_push_tokens for all using (
  auth.uid() = user_id
);

-- Orders policies
create policy "Users can view their own orders" on public.orders for select using (
  auth.uid() = customer_id or auth.uid() = chef_id
);

create policy "Customers can create orders" on public.orders for insert with check (
  auth.uid() = customer_id
);

create policy "Chefs can update order status" on public.orders for update using (
  auth.uid() = chef_id
);

-- Notification preferences policies
create policy "Users can manage their own notification preferences" on public.user_notification_preferences for all using (
  auth.uid() = user_id
);

-- Functions and triggers

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_users_updated_at before update on public.users for each row execute procedure public.update_updated_at_column();
create trigger update_chats_updated_at before update on public.chats for each row execute procedure public.update_updated_at_column();
create trigger update_orders_updated_at before update on public.orders for each row execute procedure public.update_updated_at_column();
create trigger update_promotional_deals_updated_at before update on public.promotional_deals for each row execute procedure public.update_updated_at_column();
create trigger update_user_notification_preferences_updated_at before update on public.user_notification_preferences for each row execute procedure public.update_updated_at_column();

-- Function to update chat last_message_at when new message is inserted
create or replace function public.update_chat_last_message()
returns trigger as $$
begin
  update public.chats 
  set last_message_at = new.timestamp, updated_at = now()
  where id = new.chat_id;
  return new;
end;
$$ language plpgsql;

-- Trigger to update chat timestamp on new message
create trigger update_chat_on_new_message 
  after insert on public.messages 
  for each row 
  execute procedure public.update_chat_last_message();

-- Function to create notification preferences for new users
create or replace function public.create_user_notification_preferences()
returns trigger as $$
begin
  insert into public.user_notification_preferences (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql;

-- Trigger to create default notification preferences
create trigger create_notification_preferences_on_user_create 
  after insert on public.users 
  for each row 
  execute procedure public.create_user_notification_preferences();

-- Enable real-time subscriptions
alter publication supabase_realtime add table public.chats;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.orders;
