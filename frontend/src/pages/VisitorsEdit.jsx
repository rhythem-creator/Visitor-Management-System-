// src/pages/VisitorsEdit.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

export default function VisitorsEdit() {
  const { id } = useParams();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Visitor</h1>
      <p className="text-gray-600">Page scaffolding ready. ID: <span className="font-mono">{id}</span></p>
      <p className="text-gray-500 mt-2">We’ll load the visitor and show the form in VM‑12.2/12.3.</p>
    </div>
  );
}