import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import axios from 'axios';

const Home = () => {
  const [specialtyData, setSpecialtyData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [gradeData, setGradeData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://troubled-red-garb.cyclic.app/professeurs');
      const professors = response.data;

      const specialtyCount = {};
      professors.forEach((professor) => {
        const specialties = professor.specialite.split(';');
        specialties.forEach((specialty) => {
          if (specialtyCount[specialty]) {
            specialtyCount[specialty]++;
          } else {
            specialtyCount[specialty] = 1;
          }
        });
      });

      // Convert the specialty count object to an array of data objects
      const specialtyChartData = Object.keys(specialtyCount).map((specialty) => ({
        name: specialty,
        population: specialtyCount[specialty],
        color: getRandomColor(), // Generate a random color
      }));

      setSpecialtyData(specialtyChartData);

      // Count the number of professors per city
      const cityCount = {};
      professors.forEach((professor) => {
        const villeDesiree = professor.villeDesiree;
        if (villeDesiree) {
          const cities = villeDesiree.split(';');
          cities.forEach((city) => {
            const trimmedCity = city.trim(); // Remove leading/trailing whitespaces
            if (cityCount[trimmedCity]) {
              cityCount[trimmedCity]++;
            } else {
              cityCount[trimmedCity] = 1;
            }
          });
        }
      });

      // Convert the city count object to an array of data objects
      const cityChartData = Object.keys(cityCount).map((city) => ({
        name: city,
        population: cityCount[city],
        color: getRandomColor(), // Generate a random color
      }));

      setCityData(cityChartData);

      // Count the number of professors per grade
      const gradeCount = {};
      professors.forEach((professor) => {
        const grade = professor.grade;
        if (grade) {
          if (gradeCount[grade]) {
            gradeCount[grade]++;
          } else {
            gradeCount[grade] = 1;
          }
        }
      });

      // Convert the grade count object to an array of data objects
      const gradeChartData = Object.keys(gradeCount).map((grade) => ({
        name: grade,
        population: gradeCount[grade],
        color: getRandomColor(), // Generate a random color
      }));

      setGradeData(gradeChartData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    legendFontColor: 'red',
    legendFontSize: 12,
  };

  const renderLegendItem = (legend) => (
    <View key={legend.name} style={styles.legendItem}>
      <View style={[styles.legendColor, { backgroundColor: legend.color }]} />
      <Text style={styles.legendText}>{legend.name}</Text>
    </View>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
      <Text style={styles.chartTitle}>Nombre de profs inscrits: {specialtyData.reduce((total, specialty) => total + specialty.population, 0)}</Text>

        <Text style={styles.chartTitle}>Nombre de profs par spécialité</Text>
        <PieChart
          data={specialtyData}
          width={300}
          height={200}
          accessor="population"
          chartConfig={chartConfig}
          style={styles.chart}
        />
        <View style={styles.legendContainer}>
          {specialtyData.map(renderLegendItem)}
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.chartTitle}>Villes les plus demandées</Text>
        <PieChart
          data={cityData}
          width={300}
          height={200}
          accessor="population"
          chartConfig={chartConfig}
          style={styles.chart}
        />
        <View style={styles.legendContainer}>
          {cityData.map(renderLegendItem)}
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.chartTitle}>Nombre de profs par grade</Text>
        <PieChart
          data={gradeData}
          width={300}
          height={200}
          accessor="population"
          chartConfig={chartConfig}
          style={styles.chart}
        />
        <View style={[styles.legendContainer, styles.lastChartLegendContainer]}>
          {gradeData.map(renderLegendItem)}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  lastChartLegendContainer: {
    marginBottom: 30,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
});

export default Home;
