import './LoginScreen.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useParams} from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {

    let { token } = useParams();
    let navigate = useNavigate();

    useEffect (() => {
        if (firebase.auth().currentUser) {
            navigate('/');
        } else if (token) {
            firebase.auth().signInWithCustomToken(token)
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error("Error logging in with Custom token", error);
            });
        }
    }, []);

    return (
        <div className="login-screen">
          <div className="nav-bar">
            <div className="text-wrapper">Filter GPT</div>
            <div className="spacer" />
            <button onClick={() => console.log('menu clicked')}>
                <svg className="vector"  fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.11111 0C0.497467 0 0 0.6396 0 1.42857C0 2.21754 0.497467 2.85714 1.11111 2.85714H18.8889C19.5026 2.85714 20 2.21754 20 1.42857C20 0.6396 19.5026 0 18.8889 0H1.11111ZM0 10C0 9.211 0.497467 8.57143 1.11111 8.57143H18.8889C19.5026 8.57143 20 9.211 20 10C20 10.789 19.5026 11.4286 18.8889 11.4286H1.11111C0.497467 11.4286 0 10.789 0 10ZM0 18.5714C0 17.7824 0.497467 17.1429 1.11111 17.1429H18.8889C19.5026 17.1429 20 17.7824 20 18.5714C20 19.3604 19.5026 20 18.8889 20H1.11111C0.497467 20 0 19.3604 0 18.5714Z" fill="white"/>
                </svg>
            </button>
          </div>
          <div className="mx-auto content w-full max-w-screen-md">
            <div className="pitch">
              <h1 className="h-1 h-full">AI Filters For Emails</h1>
              <p className="p">
                An easy-to-use AI tool that creates email that creates email filters for a more organized inbox on Gmail.
              </p>
              <a className="sign-in-with-google"
                href={"https://accounts.google.com/o/oauth2/v2/auth?scope=email%20https://www.googleapis.com/auth/gmail.modify&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=https://us-central1-social-inbox-7390f.cloudfunctions.net/api/callback/gmail&client_id=381284035418-bq0is08h42d8rv1u9akmfphlkri1681b.apps.googleusercontent.com&state=" + window.location.href}
              >
                <div className="div">Sign in with Google</div>
              </a>
            </div>
          </div>
        </div>
      );
};

export default LoginScreen;
