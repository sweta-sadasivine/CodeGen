import React, {useState} from 'react';
import {
    Button,
    Container,
    AppBar,
    Box,
    Toolbar,
    Typography,
    TextField,
    Grid
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme({
    palette: {
        primary: {
            main: '#631976',
        }
    },
});

function Home() {

    const [replaceJson, setReplaceJson] = useState();
    const [filename, setFilename] = useState('');

    const onSubmit = (event) => {
        console.log(replaceJson);
        console.log(filename);
    }

    return (
        <Container>
            <ThemeProvider theme={theme}>
                <AppBar position="static">
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <Box
                                component="img"
                                sx={{ height: 54 }}
                                alt="Logo"
                                src={"/Ellucian_PowerButton.png"}
                            />
                            <Typography
                                variant="h4"
                                noWrap
                                component="a"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                    ml: 5
                                }}
                            >
                                Test Generator
                            </Typography>
                        </Toolbar>
                    </Container>
                </AppBar>
                <br />
                <Grid container alignItems="flex-end" >
                    <Grid item xs={8} sm={8}>
                        <TextField
                            id="json"
                            label="JSON"
                            variant="outlined"
                            required maxRows={15}
                            minRows={15}
                            sx={{ gap: 2, flexGrow: 1 }}
                            color='secondary'
                            multiline
                            fullWidth
                            onChange={(e) => setReplaceJson(e.target.value)} 
                            value={replaceJson}
                        />
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    xs={12}
                    direction="row"
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'flex-start',
                        pt: 3
                    }}
                >
                    <Grid item xs={6} sm={3}>
                        <TextField
                            id="filename"
                            label="File Name"
                            variant="outlined"
                            required
                            sx={{ flexGrow: 1 }}
                            color='secondary'
                            onChange={(e) => setFilename(e.target.value)} 
                            value={filename}
                        />
                    </Grid>
                </Grid>
                <br />
                <Button variant="contained" color="primary" onClick={() => onSubmit()}>
                    Generate
                </Button>
            </ThemeProvider>
        </Container>
    );

}

export default Home;
