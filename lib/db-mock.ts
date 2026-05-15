// Mock In-Memory Database for local testing
import bcrypt from "bcryptjs";

interface Doctor {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  specialization: string;
  status?: string;
  created_at?: Date;
}

interface Patient {
  id: number;
  doctor_id: number;
  full_name: string;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  dietary_habit: string;
  bowel_movement: string;
  water_intake: string;
  health_condition: string;
}

// Use global to persist data across hot-reloads
declare global {
  var mockStore: {
    doctors: Doctor[];
    patients: Patient[];
    diet_charts: any[];
    diet_chart_items: any[];
    food_items: any[];
    recipes: any[];
    recipe_ingredients: any[];
    water_logs: any[];
  } | undefined;
}

let store = globalThis.mockStore || {
  doctors: [] as Doctor[],
  patients: [] as Patient[],
  diet_charts: [] as any[],
  diet_chart_items: [] as any[],
  food_items: [] as any[],
  recipes: [] as any[],
  recipe_ingredients: [] as any[],
  water_logs: [] as any[]
};

// Save to global for persistence
globalThis.mockStore = store;

export const sql = async (template: TemplateStringsArray, ...values: any[]): Promise<any[]> => {
  const query = template[0];

  console.log("🗄️ Mock DB Query:", query.substring(0, 50), "| Values:", values.length, "| Store doctors:", store.doctors.length);
  
  // SELECT doctors by email
  if (query.includes("SELECT * FROM doctors WHERE email")) {
    const email = values[0];
    console.log("🗄️ Looking for doctor with email:", email, "| Stored doctors:", store.doctors.map(d => d.email));
    const result = store.doctors.filter(d => d.email === email);
    console.log("🗄️ Query result for email lookup:", { email, found: result.length, doctors: result.map(d => ({ id: d.id, email: d.email })) });
    return result;
  }

  // SELECT id FROM doctors WHERE email (for checking existence)
  if (query.includes("SELECT id FROM doctors WHERE email")) {
    const email = values[0];
    const result = store.doctors.filter(d => d.email === email).map(d => ({ id: d.id }));
    console.log("🗄️ Query result for id lookup:", { email, found: result.length });
    return result;
  }
  
  // SELECT doctors (all)
  if (query.includes("SELECT * FROM doctors")) {
    return store.doctors;
  }
  
  // SELECT patients
  if (query.includes("SELECT * FROM patients")) {
    return store.patients;
  }
  
  // SELECT patients by id
  if (query.includes("SELECT * FROM patients WHERE id")) {
    const id = values[0];
    return store.patients.filter(p => p.id === id);
  }
  
  // INSERT INTO doctors
  if (query.includes("INSERT INTO doctors")) {
    const doctor: Doctor = {
      id: store.doctors.length + 1,
      name: values[0],
      email: values[1],
      password_hash: values[2], // Use the hash passed in (newly generated or pre-computed)
      specialization: values[3],
      status: "approved", // Auto-approve in mock for testing
      created_at: new Date()
    };
    store.doctors.push(doctor);
    console.log("🗄️ Inserted doctor:", { id: doctor.id, email: doctor.email, passwordHashLength: doctor.password_hash.length });
    return [{ id: doctor.id }];
  }
  
  // INSERT INTO patients
  if (query.includes("INSERT INTO patients")) {
    const patient: Patient = {
      id: store.patients.length + 1,
      doctor_id: values[0],
      full_name: values[1],
      age: values[2],
      gender: values[3],
      height_cm: values[4],
      weight_kg: values[5],
      dietary_habit: values[6],
      bowel_movement: values[7],
      water_intake: values[8],
      health_condition: values[9]
    };
    store.patients.push(patient);
    return [{ id: patient.id }];
  }
  
  // Check if exists
  if (query.includes("SELECT id FROM doctors WHERE email")) {
    const email = values[0];
    const exists = store.doctors.find(d => d.email === email);
    return exists ? [{ id: exists.id }] : [];
  }

  // COUNT queries
  if (query.includes("SELECT COUNT(*) as count FROM patients WHERE doctor_id")) {
    const doctor_id = values[0];
    const count = store.patients.filter(p => p.doctor_id === doctor_id).length;
    return [{ count }];
  }

  if (query.includes("SELECT COUNT(*) as count FROM diet_charts WHERE doctor_id")) {
    const doctor_id = values[0];
    const count = store.diet_charts.filter(d => d.doctor_id === doctor_id).length;
    return [{ count }];
  }

  if (query.includes("SELECT COUNT(*) as count FROM food_items")) {
    const count = store.food_items.length;
    return [{ count }];
  }
  
  return [];
};

// For debugging
export const getMockData = () => store;
