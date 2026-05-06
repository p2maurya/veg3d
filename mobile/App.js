import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';

// Note: React Native requires a different 3D renderer like expo-gl or react-native-filament.
// In this scaffold, we show the same API data as the web app.

const API_URL = 'http://10.0.2.2:5000/api/food'; // For Android Emulator, use your backend IP

export default function App() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      // Connect to the Node backend
      const res = await axios.get(API_URL);
      setFoods(res.data);
    } catch (err) {
      console.log('Error fetching foods', err);
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={[styles.placeholder3D, { backgroundColor: item.color }]} />
      <View style={styles.cardContent}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodPrice}>₹{item.price}</Text>
      </View>
      <Text style={styles.foodDesc} numberOfLines={2}>{item.description}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Veg3D Delivery</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={foods}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  placeholder3D: {
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  foodPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  foodDesc: {
    color: '#94a3b8',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
