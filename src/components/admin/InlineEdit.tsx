import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, Edit } from 'lucide-react';

interface InlineEditProps {
  value: string | number;
  onSave: (value: string | number) => void;
  type?: 'text' | 'number';
  prefix?: string;
  suffix?: string;
}

const InlineEdit = ({ value, onSave, type = 'text', prefix = '', suffix = '' }: InlineEditProps) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2 min-w-32">
        <Input
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(type === 'number' ? Number(e.target.value) : e.target.value)}
          className="h-8 w-full min-w-20 bg-white border-gray-300 text-gray-900 text-sm"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
        />
        <Button size="sm" variant="ghost" onClick={handleSave} className="text-green-600 hover:bg-green-50 p-1">
          <Check className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={handleCancel} className="text-red-600 hover:bg-red-50 p-1">
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setEditing(true)}>
      <span>{prefix}{value}{suffix}</span>
    </div>
  );
};

export default InlineEdit;