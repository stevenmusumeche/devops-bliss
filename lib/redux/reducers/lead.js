const initialState = { email: null };

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SIGNUP_LEAD":
      let { email } = payload;
      return {
        ...state,
        email
      };
    default:
      return state;
  }
};

export function signupLead({ email }) {
  return {
    type: "SIGNUP_LEAD",
    payload: { email },
    meta: {
      analytics: {
        event: "Signed Up",
        value: email
      }
    }
  };
}
