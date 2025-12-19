import React, { useState } from 'react';
import RobotBuilder from '../components/RobotBuilder';
import { RobotConfig } from '../types';

const INITIAL_CONFIG: RobotConfig = {
    id: 'custom-1',
    name: 'مكتشف الصحراء v1',
    type: 'rover',
    color: '#2D89E5',
    sensors: ['ultrasonic', 'infrared', 'gps'],
    sensorConfig: {
        ultrasonic: { range: 200 },
        infrared: { sensitivity: 50 },
        gps: { updateRate: '1Hz' }
    }
};

const RobotCustomizer: React.FC = () => {
    const [config, setConfig] = useState<RobotConfig>(INITIAL_CONFIG);

    const handleSave = () => {
        alert('تم حفظ تكوين الروبوت بنجاح! يمكنك الآن استخدامه في المحاكي.');
        console.log('Saved Config:', config);
    };

    return (
        <div className="min-h-screen pt-20">
            <RobotBuilder config={config} setConfig={setConfig} onSave={handleSave} />
        </div>
    );
};

export default RobotCustomizer;