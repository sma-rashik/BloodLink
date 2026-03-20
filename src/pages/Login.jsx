import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet } from 'lucide-react';
import Button from '../components/Button';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Save or merge to Firestore Database
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      
      let profileData = {
          uid: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          phone: '',
          address: '',
          lastDonation: '',
          isAvailable: true,
          group: 'A+' // default placeholder
      };

      if (docSnap.exists()) {
         profileData = { ...profileData, ...docSnap.data() };
      } else {
         // Create the user document on their first sign in
         await setDoc(userRef, profileData);
      }

      // Save to localStorage for immediate UI render speed
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      navigate('/home');

    } catch (error) {
      console.error("Error signing in with Google:", error);
      alert(`Google Sign-In failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-6 bg-gradient-to-br from-red-50 to-white">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 space-y-8 border border-red-100 relative">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Droplet className="text-red-600 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">BloodLink</h1>
          <p className="text-gray-500 text-sm">Every drop counts. Save a life today.</p>
        </div>

        {/* Action Section */}
        <div className="pt-6">
          <Button 
            onClick={onGoogleSignIn}
            fullWidth 
            type="button" 
            variant="primary" 
            className="py-4 text-lg shadow-red-200 flex items-center justify-center gap-3 bg-white border-2 border-gray-200 !text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all font-semibold" 
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>
          <p className="text-xs text-center text-gray-400 mt-6 px-4 leading-relaxed">
            By continuing, you agree to BloodLink's Terms of Service and Privacy Policy.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
