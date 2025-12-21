
export enum RobotCommand {
  FORWARD = 'FORWARD',
  BACKWARD = 'BACKWARD',
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT',
  WAIT = 'WAIT'
}

export interface RobotState {
  x: number;
  y: number;
  direction: 0 | 90 | 180 | 270; // 0: Up, 90: Right, 180: Down, 270: Left
}

// Store & Product Types
export type ProductStatus = 'in_stock' | 'out_of_stock' | 'pre_order';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string; // Made optional for AI generation fallback
  category: 'kit' | 'part' | 'sensor' | 'complete';
  status?: ProductStatus;
  specs?: {
    weight?: string;
    battery?: string;
    speed?: string;
    payload?: string;
    processor?: string;
  };
}

// Robot Configuration Types (for Builder)
export type SensorType = 
  | 'ultrasonic' 
  | 'lidar' 
  | 'infrared' 
  | 'camera' 
  | 'camera_depth' 
  | 'color' 
  | 'imu' 
  | 'gyro' 
  | 'gps';

export interface RobotConfig {
  id: string;
  name: string;
  type: 'rover' | 'drone' | 'arm';
  color: string;
  sensors: SensorType[];
  slots: {
    core: string | null;      // Processor ID
    front: SensorType | null; // Sensor ID
    back: SensorType | null;  // Sensor ID
    left: string | null;      // Motor ID
    right: string | null;     // Motor ID
  };
  sensorConfig: {
    ultrasonic?: { range: number };
    infrared?: { sensitivity: number };
    color?: { illumination: boolean };
    gyro?: { axis: '3-axis' | '6-axis' };
    camera?: { resolution: '720p' | '1080p'; illumination: boolean; sensitivity: 'Low' | 'Medium' | 'High'; exposure: number };
    lidar?: { range: number; sampleRate: number };
    imu?: { accelRange: string; gyroRange: string };
    gps?: { updateRate: string };
    camera_depth?: { resolution: string; technology: string };
  };
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    logo?: string;
  };
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  role: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  lessons: number;
  image: string;
  price: number | 'free';
  category: 'programming' | 'electronics' | 'mechanics' | 'ai';
  rating: number;
  reviews: number;
}

// --- SIMULATION ENGINE TYPES ---

export interface ComponentSchema {
  id: string;
  type: string;
  name: string;
  powerConsumption: number;
}

export interface RobotSchema {
  processor: {
    type: string;
    position: string;
  } | null;
  slots: {
    front: ComponentSchema | null;
    back: ComponentSchema | null;
    left: ComponentSchema | null;
    right: ComponentSchema | null;
  };
  power: {
    totalCapacity: number;
    current: number;
    consumptionPerTick: number;
  };
}

export interface SensorReadings {
  distance: number; // cm
  temperature: number; // Celsius
  light: number; // Lux/Percentage
  collision: boolean;
}

export interface SimulationStepResult {
  x: number;
  y: number;
  direction: 0 | 90 | 180 | 270;
  battery: number;
  temperature: number;
  sensors: SensorReadings;
  logs: string[];
  moved: boolean;
  collisionPoint?: { x: number; y: number };
}