import axios from 'axios';
import React, { useState } from 'react';
import FileDownload from "js-file-download";
import {
    Button,
    Container,
    AppBar,
    Box,
    Toolbar,
    Typography,
    TextField,
    Grid,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { createTheme, ThemeProvider } from '@mui/material/styles';



const theme = createTheme({
    palette: {
        primary: {
            main: '#631976',
        }
    },
});

function Home() {

    //Defining the the states to be used by UI
    const [replaceJson, setReplaceJson] = useState();
    const [outFilename, setFilename] = useState('');
    const [fileUrl, setFileUrl] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

  };

    const onSubmit = async (event) => {
        event.preventDefault()
        const request = {};
        request['replaceJson'] = JSON.parse(replaceJson.replaceAll(/\\n+|\\t+/gm, ''));
        request['outputFileName'] = outFilename;

        //Sending a POST request
        axios({
            method: 'post',
            url: `http://localhost:5000/codegenerator/api/generate`,
            data: request,
            responseType: 'blob'
        })
            .then((res) => {
                window.location.reload();
                FileDownload(res.data, `${outFilename}.zip`);
            })
            .catch(error => console.log('Error'));
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
                    <Grid item xs={12} sm={8}>
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
                        justifyContent: 'space-evenly',
                        pt: 3
                    }}
                >
                    <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                        Upload
                        <input hidden accept="zip/*" type="file" onChange={handleFileUpload} />
                    </Button>
                    <Grid item xs={6} sm={3}>
                        <TextField
                            id="filename"
                            label="File Name"
                            variant="outlined"
                            required
                            sx={{ flexGrow: 1 }}
                            color='secondary'
                            onChange={(e) => setFilename(e.target.value)}
                            value={outFilename}
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
