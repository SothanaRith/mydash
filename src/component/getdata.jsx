import { collection, getDocs } from 'firebase/firestore';
import { db } from "../component/firebase/firebase_config"

// Function to fetch data from Firebase
export const fetchDataFromFirebase = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return data;
  } catch (error) {
    console.error('Error fetching data from Firebase:', error);
    throw error; // You can choose to handle the error here or let the calling code handle it
  }
};