// app/(tabs-chef)/schedule.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

// minimal dot interface
interface Dot {
  key: string;
  color: string;
}

// our marked-dates entry
interface MarkedDateProps {
  dots: Dot[];
  selected?: boolean;
  selectedColor?: string;
}

// helper to format a Date as YYYY-MM-DD
function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// month names for header
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export default function ScheduleScreen() {
  const colorScheme = useColorScheme();

  // track the displayed month
  const [current, setCurrent] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // sample multi-dot markings
  const markedDates: Record<string, MarkedDateProps> = {
    '2025-09-02': {
      selected: true,
      selectedColor: '#C67C4E',
      dots: [
        { key: 'chef', color: '#C67C4E' },
        { key: 'green', color: '#4fc24f' },
        { key: 'purple', color: '#845ec2' },
      ],
    },
    '2025-09-03': { dots: [{ key: 'blue1', color: '#0d99ff' }, { key: 'blue2', color: '#0d99ff' }] },
    '2025-09-06': { dots: [{ key: 'green', color: '#4fc24f' }] },
    // …add your other dates here
  };

  // handlers to page months
  const prevMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  return (
    <View style={styles.container}>
      <Calendar
        current={formatDate(current)}
        hideArrows
        enableSwipeMonths
        markingType="multi-dot"
        markedDates={markedDates}
        renderHeader={(date: Date) => (
          <View style={styles.header}>
            <TouchableOpacity onPress={prevMonth}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {MONTHS[date.getMonth()]} {date.getFullYear()}
            </Text>
            <TouchableOpacity onPress={nextMonth}>
              <Ionicons name="chevron-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        theme={{
          backgroundColor: '#111',
          calendarBackground: '#111',
          monthTextColor: '#fff',
          textSectionTitleColor: '#888',
          dayTextColor: '#fff',
          textDisabledColor: '#444',
          selectedDayBackgroundColor: '#C67C4E',
          selectedDayTextColor: '#fff',
          todayTextColor: '#fff',
        }}
        style={styles.calendar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  calendar: {
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
});
