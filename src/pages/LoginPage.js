import styles from "./LoginPage.module.css";
import styles2 from "./SignUpPage.module.css";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate  } from "react-router-dom";

import MyForm from "./Form";


const LoginPage = () => {

  
  const  [user , setUser] = useState("")
  const [FormData , setFormData] = useState({})
  const [Errors , setErrors] = useState({})
  const navigate = useNavigate();

  
  useEffect(() => {
  const newUser = JSON.parse( localStorage.getItem('newUser') );
  setUser(newUser)
 });


function deleteU(){
    localStorage.removeItem('newUser') 
  console.log()
}

function print(){
  const state = JSON.parse( localStorage.getItem('state') );
  console.log("state: " , state)
}


function handleInputChange(e) {
  console.log(FormData)
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
}


async function handleLogin(e){
  
  e.preventDefault()
  const json =  {"email":"ils1155s1yssefss4s456s@gmail.cz" , "password": "ilyes1"}
    // const json = JSON.stringify(FormData)

  const response = await axios.post("dj-rest-auth/login/", json , {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  ).then( (response) => {
    // Assuming you have received the token from the backend in the 'response' variable
      console.log('Authorization', `Token ${response.data.key}`)
      localStorage.setItem('authToken', response.data.key);

      /**
       * ! her get the user also  , and test if it is allset or no.
       */

      
        axios.get("profile/all_set/" , {
          headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${response.data.key}`
              }
            } ).then(res => {
          console.log(res.data)
          localStorage.setItem('thisuser', JSON.stringify(res.data.myself));
          if (res.data.myself.allset == "true" && res.data.myself.role == "seller") {
            navigate("/logGiver")
            
          } else if ((res.data.myself.allset == "true" && res.data.myself.role == "client"))
          {
            navigate("/logTaker")
            
            
          }
        else { 
            
            
            /**
             * ! get the options to send it to the form */  
            
            axios.options("profile/ProfileAPIView/",  {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${response.data.key}`
              }
            })
            .then(res => {
              var formbefore = JSON.stringify(res.data.actions.PUT)
              for (const prop in res.data){
                /**
                 * * recheck the condtion down here 
                */
               
               if (res.data[prop][0] && res.data[prop][0].id)
               {console.log(res.data[prop])
                formbefore= formbefore.slice(0, -1)+","+`"${prop}" : `    +JSON.stringify(res.data[prop])+"}"
                
              }
            } 
            localStorage.setItem('form', formbefore);
            
            navigate("/my-form")
          }).catch((error) => {console.log("we have problems with second post reqeust")})
          
          }
          
        }
        )



    }

).catch((error) => {
  console.log(Errors)
  setErrors({});
  
  for (const key in test) {
    
    setErrors((prevErrors) => ({ ...prevErrors, [key]: test[key] }));
  }
 })


}  // fin handlelogin



  return (
    <div className={styles.loginPage}>
      <div className={styles.navs}>
        <div className={styles.logo}>
          <img className={styles.logoChild} alt="hehe" src="/star-15.svg" />
          <div className={styles.aicare}>aicare</div>
          <div className={styles.logoItem} />
        </div>
        <div className={styles.navLinks}>
          <div className={styles.home}>Home</div>
          <div className={styles.aboutParent}>
            <div className={styles.home}>About</div>
            <div className={styles.akarIconschevronDown} />
          </div>
          <div className={styles.home}>contact us</div>
          <div className={styles.pricingWrapper}>
            <div className={styles.home}>Pricing</div>
          </div>
          <button className={styles.button} id="hh">
            <div className={styles.buttonInner}>
              <div className={styles.signUpWrapper}>
                <div className={styles.signUp}>sign up</div>
              </div>
            </div>
          </button>
        </div>
        <div className={styles.t}>t</div>
      </div>
      <div className={styles.frameParent}>
        <button onClick={deleteU}>delte user</button>
        {/* <MyForm h = "hehe"></MyForm> */}
        <div className={styles.frameGroup}>
          <div className={styles.signInWrapper}>
            <b className={styles.signIn}>sign in</b>
            {user && (
              <div className={styles.alreadyHaveAn}>
                this is a fucking new user{" "}
              </div>
            )}
          </div>
          
          <div className={styles.email}>Email</div>
          <input
            // className={styles2.err}
            className={Errors.email ? styles2.err : styles2.email}

            type="text"
            placeholder="Please enter your email"
            maxLength
            minLength
            id="email"
            name="email"
            onChange={handleInputChange}

            />
      {Errors.email && <div className={styles.errormessage}>{Errors.email[0]}</div>}


          <div className={styles.email}>Password</div>
          <input
            // className={styles2.email}
            className={Errors.password ? styles2.err : styles2.email}

            type="password"
            placeholder="Please enter your password"
            maxLength
            minLength
            id="password"
            name="password"
            onChange={handleInputChange}

            />
            {/* // onChange={handleInputChange} */}
      {Errors.password && <div className={styles2.errormessage}>{Errors.password[0]}</div>}

            {Errors.non_field_errors && <div className={styles2.errormessage}>{Errors.non_field_errors[0]}</div>}

        </div>
  
            <button className={styles2.cta} onClick={handleLogin}>log in</button>

          {/* {} */}
          <div className={styles.alreadyHaveAn}>Already have an account</div>
      </div>
    </div>
  );
};

export default LoginPage;
