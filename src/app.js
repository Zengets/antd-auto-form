import InitForm from './components/InitForm/index.jsx'
import AutoTable from './components/AutoTable/index.jsx'
import Editor from './components/Editor/index.jsx'
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd'


function App() {
    const [state, setstate] = useState('');

    return (
        <div>
            <Button> 1132 </Button>
            <div className="bf-container" style={{ height: 320 }}>
                <Editor value={state} onChange={(val) => {
                    setstate(val)
                }} />
            </div>

        </div>
    )
}

ReactDOM.render(< App />, document.getElementById('root'));