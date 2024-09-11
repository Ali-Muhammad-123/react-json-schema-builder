import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "ProximaNova",
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "var(--bs-obsidion-700)",
          fontSize: "0.75rem",
          fontWeight: 400,
          borderRadius: "0.5rem",
          padding: "0.5rem",
          boxShadow: "var(--bs-box-shadow)",
          "&.MuiTooltip-tooltipPlacementTop": {
            marginBottom: "0.5rem !important",
          },
        },
        arrow: {
          color: "var(--bs-obsidion-700)",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderRadius: "0.5rem",
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--bs-obsidion-600)",
          },
          width: "100%",
          ".MuiSelect-nativeInput": {
            height: "100%",
          },
        },
        select: {
          padding: ".532rem .875rem .532rem .875rem",
          paddingRight: "0.5rem !important",
        },
      },
    },
    MuiMenuItem: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: "var(--bs-green-400)",
        },
      },
    },
  },
});

export default theme;
