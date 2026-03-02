import React, { useState } from 'react';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL;

const App = () => {

  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    
    setError('');
    setResult(null);

    if (!email && !phoneNumber) {
      setError("Please enter at least an email or a phone number.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/identify`, {
        email: email || null,
        phoneNumber: phoneNumber || null
      });

      setResult(response.data);

    } catch (err) {
      console.error("API Error:", err);
      setError(err.response?.data?.error || "Something went wrong connecting to the backend.");
    }
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className='flex flex-col gap-1.5 justify-center h-screen items-center'>
          
          <input 
            className='bg-gray-600 text-white w-65 px-4 py-3 rounded-2xl text-center' 
            placeholder='Enter the Email' 
            type='email' 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <input 
            className='bg-gray-600 text-white w-65 px-4 py-3 rounded-2xl text-center' 
            placeholder='Enter the Phone Number' 
            type='text' 
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <button 
            type="submit"
            className='bg-violet-300 text-white cursor-pointer active:scale-95 transition duration-150 w-65 px-4 py-3 rounded-2xl text-center'
          >
            Identify
          </button>
          
          <div className='flex flex-col items-center mt-10 p-6 h-90 w-100 bg-blue-200 rounded-xl overflow-y-auto'>
            <h1 className="font-bold mb-4 text-xl">Results</h1>
            
            {error && <p className="text-red-500 font-semibold">{error}</p>}

            {result && (
              <pre className="text-left w-full bg-blue-100 p-4 rounded text-sm overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>

        </div>
      </form>
    </div>
  )
}

export default App;