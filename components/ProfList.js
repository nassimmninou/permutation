import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Modal, SafeAreaView, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const ProfList = () => {
  const [professors, setProfessors] = useState([]);
  const [currentCityFilter, setCurrentCityFilter] = useState('');
  const [wantedCityFilter, setWantedCityFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const baseUrl = 'https://troubled-red-garb.cyclic.app/professeurs';

  useEffect(() => {
    axios
      .get(baseUrl)
      .then((response) => {
        setProfessors(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const getCurrentCityOptions = () => {
    const uniqueCities = [...new Set(professors.map((professor) => professor.villeFaculteActuelle))];
    return ['', ...uniqueCities];
  };

  const getWantedCityOptions = () => {
    const uniqueCities = [...new Set(professors.map((professor) => professor.villeDesiree.split(';').map(city => city.trim())).flat())];
    return ['', ...uniqueCities];
  };

  const getSpecialtyOptions = () => {
    const uniqueSpecialties = [...new Set(professors.map((professor) => professor.specialite))];
    return ['', ...uniqueSpecialties];
  };

  const filterProfessors = () => {
    return professors.filter((professor) => {
      const currentCityMatch = currentCityFilter === '' || professor.villeFaculteActuelle.toLowerCase().includes(currentCityFilter.toLowerCase());
      const wantedCityMatch = wantedCityFilter === '' || professor.villeDesiree.toLowerCase().includes(wantedCityFilter.toLowerCase());
      const specialtyMatch = specialtyFilter === '' || professor.specialite.toLowerCase().includes(specialtyFilter.toLowerCase());

      return currentCityMatch && wantedCityMatch && specialtyMatch;
    });
  };

  const handleProfessorPress = (professor) => {
    setSelectedProfessor(professor);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={currentCityFilter}
            onValueChange={(itemValue) => setCurrentCityFilter(itemValue)}
          >
            {getCurrentCityOptions().map((city) => (
              <Picker.Item key={city} label={city === '' ? 'All (Current City)' : city} value={city} />
            ))}
          </Picker>

          <Picker
            style={styles.picker}
            selectedValue={wantedCityFilter}
            onValueChange={(itemValue) => setWantedCityFilter(itemValue)}
          >
            {getWantedCityOptions().map((city) => (
              <Picker.Item key={city} label={city === '' ? 'All (Wanted City)' : city} value={city} />
            ))}
          </Picker>

          <Picker
            style={styles.picker}
            selectedValue={specialtyFilter}
            onValueChange={(itemValue) => setSpecialtyFilter(itemValue)}
          >
            {getSpecialtyOptions().map((specialty) => (
              <Picker.Item key={specialty} label={specialty === '' ? 'All (Specialties)' : specialty} value={specialty} />
            ))}
          </Picker>
        </View>
        <View style={styles.cardContainer}>
          <Text style={styles.cardText}>Click on professor for more details</Text>
        </View>
        <FlatList
          data={filterProfessors()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleProfessorPress(item)}>
              <Text style={styles.prof}>
                * {item.nom} - {item.villeFaculteActuelle} --> ({item.villeDesiree})
              </Text>
            </TouchableOpacity>
          )}
        />

        <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)} transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Name: {selectedProfessor?.nom}</Text>
              <Text style={styles.modalText}>Prenom: {selectedProfessor?.prenom}</Text>
              <Text style={styles.modalText}>Email: {selectedProfessor?.email}</Text>
              <Text style={styles.modalText}>Phone: {selectedProfessor?.tel}</Text>
              <Text style={styles.modalText}>Grade: {selectedProfessor?.grade}</Text>
              <Text style={styles.modalText}>Specialité: {selectedProfessor?.specialite}</Text>
              <Text style={styles.modalText}>Faculté: {selectedProfessor?.faculteActuelle}</Text>
              <Text style={styles.modalText}>Current City: {selectedProfessor?.villeFaculteActuelle}</Text>
              <Text style={styles.modalText}>Desired City: {selectedProfessor?.villeDesiree}</Text>
              {/* Add more details as needed */}
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#C1E9FF',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  picker: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  cardContainer: {
    backgroundColor: '#67A9CD',
    padding: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  prof: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    width: '80%',
    maxHeight: '80%',
    borderRadius: 8,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalCloseButton: {
    backgroundColor: '#007AFF',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ProfList;
