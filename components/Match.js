import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const Match = () => {
  const [professors, setProfessors] = useState([]);
  const [speciality, setSpeciality] = useState('');

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

  const specialities = [...new Set(professors.map((professor) => professor.specialite))];
  const filteredProfessors = professors.filter(
    (professor) => professor.specialite === speciality
  );

  const renderProfessorItem = ({ item }) => {
    const correspondingProfessors = filteredProfessors.filter(
      professor =>
        item.villeDesiree.includes(professor.villeFaculteActuelle) &&
        professor.villeDesiree.includes(item.villeFaculteActuelle) &&
        professor.nom !== item.nom && // Exclude matching professors with the same name
        professors.indexOf(professor) > professors.indexOf(item) // Exclude duplicate matches
    );
  
    return (
      <View style={styles.itemContainer}>
        <View style={styles.column}>
          <Text style={styles.professorName}>
            {item.nom} ({item.villeFaculteActuelle} - {item.villeDesiree})
          </Text>
        </View>
        <View style={styles.column}>
          {correspondingProfessors.length > 0 ? (
            correspondingProfessors.map(professor => (
              <Text style={styles.correspondingProfessorName} key={professor._id}>
                {professor.nom} ({professor.villeFaculteActuelle} - {professor.villeDesiree})
              </Text>
            ))
          ) : (
            <Text style={styles.noProfessor}>Aucun</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisir la spécialité</Text>

      <Picker
        style={styles.picker}
        selectedValue={speciality}
        onValueChange={(itemValue) => setSpeciality(itemValue)}
      >
        <Picker.Item label="Select Speciality" value="" />
        {specialities.map((speciality, index) => (
          <Picker.Item label={speciality} value={speciality} key={index} />
        ))}
      </Picker>

      {filteredProfessors.length > 0 && (
        <ScrollView contentContainerStyle={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <View style={styles.column}>
              <Text style={styles.columnHeader}>Professeur</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.columnHeader}>Permutation possible</Text>
            </View>
          </View>
          <FlatList
            data={filteredProfessors}
            renderItem={renderProfessorItem}
            keyExtractor={(item) => item._id}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#C1E9FF',

  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropdown: {
    marginBottom: 10,
  },
  tableContainer: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#67A9CD',

    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  columnHeader: {
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor:'#FFFFFF'
    
  },
  column: {
    flex: 1,
  },
  professorName: {
    fontWeight: 'bold',
  },
  correspondingProfessorName: {
    marginLeft: 10,
  },
  noProfessor: {
    fontStyle: 'italic',
    color: '#999',
    marginLeft:30
  },

  picker: {

    backgroundColor: '#FFFFFF',
    marginBottom:20
  },
});

export default Match;
