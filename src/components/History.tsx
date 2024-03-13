import { useState } from 'react';
import HistoryTable from './HistoryTable';

interface HistoryProps {
    activate: boolean;
}

function History(props: HistoryProps) {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const [date, setDate] = useState(dateString);
    const [duplicatedate, setDuplicatedate] = useState(dateString);

    return (
        <>
            {props.activate && (
                <div className="flex items-center justify-center border-black border">
                    <p className="whitespace-nowrap m-2">Select Month:</p>
                    <input
                        type="month"
                        name="month"
                        className="p-2 rounded-md m-2 border-black
                border"
                        value={duplicatedate}
                        onChange={(e) => setDuplicatedate(e.target.value)}
                    />
                    <button
                        className="bg-black-500 text-white p-2 rounded-md m-2"
                        onClick={() => setDate(duplicatedate)}
                    >
                        🔍
                    </button>
                </div>
            )}
            <div>
                <HistoryTable date={date} showMinorTable={props.activate} />
            </div>
        </>
    );
}

export default History;
