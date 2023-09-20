import { set, ref } from 'firebase/database';
import { db } from '../config/firebase.config';

const addCategories = () => {
  try {
    set(ref(db, 'categories/javascript'), true);
    set(ref(db, 'categories/csharp'), true);
    set(ref(db, 'categories/java'), true);
  } catch (error) {
    console.error('Error adding categories:', error);
  }
};

addCategories();
