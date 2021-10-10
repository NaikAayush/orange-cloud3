module.exports = {
  prefix: "",
  purge: {
    // enabled: true,
    content: ["./src/**/*.{html,ts}"],
  },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      // backgroundImage: {
      //   "login-illustration": "url('assets/login/login-illustration.svg')",
      // },
      colors: {
        custom: {
          100: "#E5EBF8",
          200: "#343434",
          300: "#244D9D",
        },
        grey: {
          100: "#FCFCFC",
          200: "#F3F2F7",
          300: "#D0D6DE",
          3: "#ECEAF3",
          400: "#B9BBBD",
          500: "#A3A3A3",
          body: "#464255",
          dark: "#464255",
        },
        theme: {
          primary: "#B7DBF9",
          secondary: "#AB54DB",
          tertiary: "#EF9A91",
          quatinery: "#F1E6B9",
          success: "#00A389",
          danger: "#FF5B5B",
          warning: "#FFBB54",
          info: "#58CDFF",
        },
        indigo: {
          500: "#B7DBF9",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
};
