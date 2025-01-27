import React from 'react'
import ListView from './ListView';
import AddItemForm from './AdditemForm';

function Carry() {
    const data = [
        { id: 1, name: 'Name' },
        { id: 2, name: 'Name' },
        // Add more data here
      ];
    return (
    <div className="flex-1 p-6">
        <ListView data={data} />
        <AddItemForm />
    </div>
  )
}

export default Carry
