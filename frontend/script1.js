const signUp = document.querySelector('.sign-up');
const signIn = document.querySelector('.sign-in');

const btn1 = document.querySelector('.opposite-btn1');
const btn2 = document.querySelector('.opposite-btn2');

// Switches to 'Create Account'
btn1.addEventListener('click', () => {
  signUp.style.display = 'block';
  signIn.style.display = 'none'; 
});

// Switches to 'Sign In'
btn2.addEventListener('click', () => {
  signUp.style.display = 'none';
  signIn.style.display = 'block';
});

const signupForm = document.getElementById('signupForm');
const signinForm = document.getElementById('signinForm');

// 👇 Listen for signup form submission
signupForm.addEventListener('submit', async function (event) {
  event.preventDefault(); // 👈 prevent page reload
  const username = signupForm.name.value;
  const email = signupForm.email.value;
  const password = signupForm.password.value;

  try {
    const response = await axios.post("http://localhost:3000/api/v1/users/signup", {
      name: username,
      email: email,
      password: password
    });
    alert("Account created successfully");
    console.log(response.data);
    signupForm.reset();
    // Optionally switch to sign-in view
    signUp.style.display = 'none';
    signIn.style.display = 'block';
  } catch (error) {
    console.error("Error during signup:", error.response?.data || error.message);
    alert("Signup failed");
  }
});

// 👇 Listen for signin form submission
signinForm.addEventListener('submit', async function (event) {
  event.preventDefault(); // 👈 prevent page reload
  const email = signinForm.email.value;
  const password = signinForm.password.value;

  try {
    const response = await axios.post("http://localhost:3000/api/v1/users/signin", {
      email: email,
      password: password
    });
    localStorage.setItem("token", response.data.token);
    alert("Sign in successful");
    signinForm.reset();
    // redirect to dashboard or home
    window.location.href = "/dashboard.html";
  } catch (error) {
    console.error("Error during signin:", error.response?.data || error.message);
    alert("Signin failed");
  }
});
