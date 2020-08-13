import React from 'react'
import './.css';

import { Button, TextField } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import 'date-fns';

import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';

import {useState, useContext} from 'react'
import { FirebaseContext } from '../Firebase'


const useStyles = makeStyles({
    table: {
      minWidth: 550,
    },
    
  });


const Welcome = () => {

    const classes = useStyles();

    const firebase = useContext(FirebaseContext);

    
    // conversion de la date timestamp 
    
    // année/mois/jour
    const amj = new Intl.DateTimeFormat("fr-Fr", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      // heure:minute:second
      const hms = new Intl.DateTimeFormat("fr-Fr", {
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit'
      });

    // Variables ----------------------------------------------------------------------------

    const [utilisateur, setUtilisateur] = useState('');
    const [heure, setHeure] = useState(hms.format(Date.now()).toString());
    const [poste, setPoste] = useState(0);
    const [selectedDate, setSelectedDate] = React.useState(Date.now());

    const [btnAjouter, setBtnAjouter] = useState(false);

    const [attr, setAttr] = React.useState([]);

    // Gestion de l'envoie du formulaire ----------------------------------------------------
    const handleSubmit = e => {
    e.preventDefault()
    }

    const handleDateChange = (date) => {
        setSelectedDate(date);
      };
 
    React.useEffect(() => {
        const fetchData = async () => {
          const db = firebase.db;
          const data = await db.collection("Attribution").get();
          setAttr(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        };
        fetchData();
      }, []);

    return(
            <div className="row">

            {/* Table ------------------------------------------------------------------------------------------------------ */}    
            <div className="column" style={{backgroundColor:'#aaa'}}>

                <h2> Attribution </h2>

                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell >Id</TableCell>
                            <TableCell align="right"> Utilisateur</TableCell>
                            <TableCell align="right"> Poste&nbsp;</TableCell>
                            <TableCell align="right"> Date&nbsp;</TableCell>
                            <TableCell align="right"> Heure&nbsp;</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {attr.map(attr => (
                            <TableRow key={attr.id}>
                            <TableCell > {attr.id} </TableCell>
                            <TableCell align="right"> {attr.utilisateur} </TableCell>
                            <TableCell align="right"> {attr.poste} </TableCell>
                            <TableCell align="right"> {amj.format(attr.date).toString()} </TableCell>
                            <TableCell align="right"> {hms.format(attr.date).toString()} </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>


                <p>Some text..</p>
            </div>

            {/* Ajout d'un utilisateur -------------------------------------------------------------------------------------- */}
            <div className="column" style={{backgroundColor:'#bbb'}}>

                <h4> Ajouter un nouvel utilisateur </h4>
                
                <form noValidate onSubmit={handleSubmit}>

                    {/* Utilisateur -------------------------------------------------------------------------- */}
                    <TextField
                    onChange={ e => setUtilisateur(e.target.value) }
                    value={utilisateur}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="utilisateur"
                    name="utilisateur"
                    autoComplete="off"
                    autoFocus
                    />
                    
                    {/*Date --------------------------------------------------------------------------------- */}
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date"
                            label="Date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>

                    {/*Heure --------------------------------------------------------------------------------- */}
                    <TextField
                    onChange={ e => setHeure(e.target.value) }
                    value={heure}          
                    variant="outlined"
                    margin="normal"
                    required
                    label="Heure"
                    autoComplete="off"
                    defaultValue="00:00:00"
                    autoFocus
                    />

                    {/* numéro de poste ------------------------------------------------------------------------ */}
                    <TextField
                        onChange={ e => setPoste(e.target.value) }
                        required
                        value={poste}     
                        label="Poste"
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{ inputProps: { min: 0} }}
                        fullWidth
                        variant="outlined"
                        autoComplete="off"
                        autoFocus
                        margin="normal"
                    />

<TextField
          error
          id="outlined-error-helper-text"
          label="Error"
          defaultValue="Hello World"
          helperText="Incorrect entry."
          variant="outlined"
          InputProps={{ 
            style: {
                color: "red"
            }
          }}
        />

                    <br /> <br />
                    {/* Bouton ajouter ------------------------------------------------------------------------- */}
                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    >
                    Ajouter
                    </Button>
                </form>

            </div>
            </div>
    )
}

export default Welcome;