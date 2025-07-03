-- Create user profiles table for extended profile information
-- This extends the existing auth.users with additional profile data

create table if not exists public.user_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  full_name text,
  bio text,
  location text,
  user_type text check (user_type in ('customer', 'chef')) default 'customer',
  avatar_url text,
  phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS (Row Level Security)
alter table public.user_profiles enable row level security;

-- Create policies so users can only access their own profiles
create policy "Users can view their own profile" on public.user_profiles
  for select using (auth.uid() = user_id);

create policy "Users can insert their own profile" on public.user_profiles
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own profile" on public.user_profiles
  for update using (auth.uid() = user_id);

-- Function to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (user_id, full_name, user_type)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile for new users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_user_profiles_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to update updated_at column
create trigger update_user_profiles_updated_at
  before update on public.user_profiles
  for each row
  execute procedure public.update_user_profiles_updated_at();
