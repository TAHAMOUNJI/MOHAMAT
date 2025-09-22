import React, { useState } from 'react';
import Papa from 'papaparse';
import { LegalText } from '../types';

interface ImportLegalTextsProps {
  onImport: (data: LegalText[]) => void;
}

const ImportLegalTexts: React.FC<ImportLegalTextsProps> = ({ onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (file) {
      setIsParsing(true);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const importedData = results.data as LegalText[];
          onImport(importedData);
          setIsParsing(false);
          setFile(null);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          setIsParsing(false);
        }
      });
    }
  };

  return (
    <div className="my-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Importer des textes juridiques (CSV)</h3>
      <p className="text-sm text-gray-500 mb-2">
        Le fichier CSV doit contenir des en-têtes correspondant aux champs de texte juridique (par exemple, id, title, category, articleNumber, content).
      </p>
      <div className="flex items-center">
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          className="p-2 border rounded" 
        />
        <button 
          onClick={handleImport} 
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={!file || isParsing}
        >
          {isParsing ? 'Importation...' : 'Importer'}
        </button>
      </div>
    </div>
  );
};

export default ImportLegalTexts;