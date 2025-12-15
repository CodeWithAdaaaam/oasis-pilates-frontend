// app/(admin)/admin/components/CourseModal.tsx
'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Course } from '@/types';

interface CourseModalProps {
  courseToEdit?: Course | null;
  onClose: () => void;
  onSave: (savedCourse: Course) => void;
}

export default function CourseModal({ courseToEdit, onClose, onSave }: CourseModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'PILATES',
    startTime: '',
    duration: 60,
    coachName: '',
  });
  const [error, setError] = useState('');

  // Pré-remplir le formulaire si on est en mode édition
  useEffect(() => {
    if (courseToEdit) {
      setFormData({
        title: courseToEdit.title,
        type: courseToEdit.type,
        // Formater la date pour le champ datetime-local
        startTime: new Date(courseToEdit.startTime).toISOString().substring(0, 16),
        duration: courseToEdit.duration,
        coachName: courseToEdit.coachName,
      });
    }
  }, [courseToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Convertir la durée en nombre
    const dataToSend = {
      ...formData,
      duration: Number(formData.duration),
    };

    try {
      let savedCourse: Course;
      if (courseToEdit) {
        // Mode édition
        const response = await api.put<Course>(`/courses/${courseToEdit.id}`, dataToSend);
        savedCourse = response.data;
      } else {
        // Mode création
        const response = await api.post<Course>('/courses', dataToSend);
        savedCourse = response.data;
      }
      onSave(savedCourse); // Envoyer le cours sauvegardé au parent
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg relative text-sage">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">&times;</button>
        <h2 className="font-serif text-3xl font-bold mb-6">
          {courseToEdit ? 'Modifier le cours' : 'Nouveau Cours'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" type="text" placeholder="Titre (ex: Pilates Reformer Matin)" value={formData.title} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
          <select name="type" value={formData.type} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
            <option value="PILATES">Pilates</option>
            <option value="YOGA">Yoga</option>
          </select>
          <input name="startTime" type="datetime-local" value={formData.startTime} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
          <input name="duration" type="number" placeholder="Durée (en minutes)" value={formData.duration} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
          <input name="coachName" type="text" placeholder="Nom du coach" value={formData.coachName} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg font-bold">Annuler</button>
            <button type="submit" className="px-6 py-2 bg-sage text-white rounded-lg font-bold">Sauvegarder</button>
          </div>
        </form>
      </div>
    </div>
  );
}