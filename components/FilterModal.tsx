import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterSection {
  label: string;
  options: string[];
  selected: string[];
  setSelected: (items: string[]) => void;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
  sections: FilterSection[];
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply, sections }) => {
  const toggleSelection = (
    item: string,
    selectedItems: string[],
    setSelectedItems: (items: string[]) => void
  ) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter your search</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={28} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {sections.map((section) => (
              <View key={section.label}>
                <Text style={styles.label}>{section.label.toUpperCase()}:</Text>
                <View style={styles.chipGroup}>
                  {section.options.map((item) => {
                    const isSelected = section.selected.includes(item);
                    return (
                      <TouchableOpacity
                        key={item}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() =>
                          toggleSelection(item, section.selected, section.setSelected)
                        }
                      >
                        <Text
                          style={[styles.chipText, isSelected && styles.chipTextSelected]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity>
                    <Text style={styles.seeAll}>See All 〉</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.filterBtn} onPress={onApply}>
              <Text style={styles.filterBtnText}>FILTER</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#C67C4E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '95%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    color: 'white',
    fontSize: 13,
    marginTop: 18,
    marginBottom: 6,
    fontWeight: '600',
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  chipSelected: {
    backgroundColor: 'white',
  },
  chipText: {
    color: 'white',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#C67C4E',
    fontWeight: '600',
  },
  seeAll: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    alignSelf: 'center',
    paddingHorizontal: 6,
    marginTop: 16,
  },
  filterBtn: {
    backgroundColor: 'white',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 18,
  },
  filterBtnText: {
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
});

export default FilterModal;

/**const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
const [selectedServices, setSelectedServices] = useState<string[]>([]);

const filterSectionsForChefs = [
  {
    label: 'Experience Level',
    options: ['Beginner', 'Intermediate', 'Expert'],
    selected: selectedExperience,
    setSelected: setSelectedExperience,
  },
  {
    label: 'Cuisine Specialties',
    options: ['Italian', 'Indian', 'French', 'Japanese'],
    selected: selectedSpecialties,
    setSelected: setSelectedSpecialties,
  },
  {
    label: 'Service Type',
    options: ['Home Cook', 'Event Catering', 'Meal Plan'],
    selected: selectedServices,
    setSelected: setSelectedServices,
  },
];

// In JSX
<FilterModal
  visible={showChefFilter}
  onClose={() => setShowChefFilter(false)}
  onApply={() => {
    // Optional: implement chef filtering logic
    setShowChefFilter(false);
  }}
  sections={filterSectionsForChefs}
/>
 */
