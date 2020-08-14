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

    // > Variables ----------------------------------------------------------------------------

    // >> Conversion de la date (timestamp) ---------------------------------------

    // >>> année/mois/jour
    const amj = new Intl.DateTimeFormat("fr-Fr", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      // >>> heure:minute:second
      const hm = new Intl.DateTimeFormat("fr-Fr", {
        hour: '2-digit', 
        minute: '2-digit'
      });  
     
    // >> Variables concernant la base de donnée ---------------------------------
    const firebase = useContext(FirebaseContext);
    const [attr, setAttr] = React.useState([]);
    const [utilisateur, setUtilisateur] = useState('');
    const [heure, setHeure] = useState(hm.format(Date.now()).toString());
    const [poste, setPoste] = useState(0);
    const [selectedDate, setSelectedDate] = React.useState(Date.now); // Si on souhaite récupérer cette valeur (Data.now) faire 
                                                                      //  amj.format(...).toString() 
    const [id, setId] = useState('');                                                                  
    

    // >> Variables lorsque le poste n'est pas conforme ---------------------------                                                                      
    const [btnAjouter, setBtnAjouter] = useState(false);
    const [labelPoste, setLabelPoste] = useState("Poste");
    const [helperTextPoste, sethelperTextPoste] = useState(null);
    const [couleur, setCouleur] = useState('black');    

    const [index, setIndex] = useState(0);    

    // Fonctions -----------------------------------------------------------------------------------------

    // Gestion de l'envoie du formulaire --------------------------------------------
    const onUpdate = e => {
        // e.preventDefault()
        const db = firebase.db;
        console.log("utilisateur:", utilisateur,
                    "poste:", poste,
                    "date:", amj.format(selectedDate).toString(),
                    "heure:", heure)

        // db.collection('Attribution').add({
        //     utilisateur: utilisateur,
        //     poste: poste,
        //     date: selectedDate 

        // })
    }

    // Récupération de la date ------------------------------------------------------
    const handleDateChange = (date) => {
        setSelectedDate(date);
      };
 

    // Traitement de la base de donnée -----------------------------------------------------------------------------

    // Supression ---------------------------------------------------------------------
    const onDelete = e => {
        e.preventDefault()
        const db = firebase.db;
        db.collection('Attribution').doc(id).delete()
        setId('')
    }

    // Récupération de la base de donnée --------------------------------------------  
    React.useEffect(() => {
        const db = firebase.db;
        return db.collection("Attribution").onSnapshot((snapshot) => {
            const attrData = []
            snapshot.forEach(doc => attrData.push(({ ...doc.data(), id: doc.id }))) 
            setAttr(attrData)
            }); 
        }, []);

    const handleCellClick = (e) => {
        const index = e.target.parentElement.getAttribute('data_key')
        //console.log(_id)
        //console.log(attr[_id].utilisateur)
        setUtilisateur(attr[index].utilisateur)
        setPoste(attr[index].poste)
        setHeure(hm.format(attr[index].date))
        setSelectedDate(Date(attr[index].date))
        console.log(new Date(attr[index].date))
    }

    // Conformité du poste ----------------------------------------------------------
    React.useEffect(() => {
        const posteDispo = () => {
            if(poste<0 || attr.some(item => item.poste == poste)){ // Si le poste est supérieur à 0 ou que c'est un nombre 
                                                                   //  qui n'est pas déjà dans la base.
                setBtnAjouter(true)
                setLabelPoste("Erreur")
                setCouleur("red")
                sethelperTextPoste("Valeur non conforme ou poste déjà prit")

            } else {

                setBtnAjouter(false)
                setLabelPoste("Poste")
                setCouleur("black")
                sethelperTextPoste(null)
            }
        };
        posteDispo()        
    })

    // ==============================================================================================================================

    return(

        <div className="row" >  {/* ref={React.createRef()}> */}

            {/* Table ------------------------------------------------------------------------------------------------------ */}    
            <div className="column1">

                <h2> Attribution </h2>

                <TableContainer component={Paper}>
                    <Table aria-label="simple table" >
                        <TableHead>
                        <TableRow > 
                            <TableCell >Id</TableCell>
                            <TableCell align="right"> Utilisateur</TableCell>
                            <TableCell align="right"> Poste&nbsp;</TableCell>
                            <TableCell align="right"> Date&nbsp;</TableCell>
                            <TableCell align="right"> Heure&nbsp;</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {attr.map( (_attr, index) => (
                            <TableRow key={_attr.id} data_key={index} onClick={handleCellClick}>
                            <TableCell> {_attr.id} </TableCell>
                            <TableCell align="right"> {_attr.utilisateur} </TableCell>
                            <TableCell align="right"> {_attr.poste} </TableCell>
                            <TableCell align="right"> {amj.format(_attr.date).toString()} </TableCell>
                            <TableCell align="right"> {hm.format(_attr.date).toString()} </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
            </div>

            {/* Ajout d'un utilisateur -------------------------------------------------------------------------------------- */}
            <div className="column">

                <h4> Ajout </h4>
                
                <form noValidate onSubmit={onUpdate}>

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
                        autoFocus
                    />

                    {/* numéro de poste ------------------------------------------------------------------------ */}
                    <TextField
                        error={btnAjouter}
                        onChange={ e => setPoste(e.target.value) }
                        required
                        value={poste}     
                        label={labelPoste}
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
                        helperText={helperTextPoste}
                        InputProps={{ 
                            style: {
                                color: couleur
                            }
                        }}
                    />

                    <br /> <br />
                    {/* Bouton ajouter ------------------------------------------------------------------------- */}
                    <Button 
                        disabled={btnAjouter}
                        type="submit"
                        fullWidth
                        variant="contained"
                    >
                        Ajouter
                    </Button>

                </form>

            </div>
            
            <div className="column" >
                <h4> Suppresion </h4>

                <form noValidate onSubmit={onDelete}>
                {/* Id -------------------------------------------------------------------------- */}
                <TextField
                    onChange={ e => setId(e.target.value) }
                    value={id}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="ID"
                    name="id"
                    autoComplete="off"
                    autoFocus
                />

                {/* Bouton ajouter ------------------------------------------------------------------------- */}
                <Button 
                    type="submit"
                    fullWidth
                    variant="contained"
                >
                    Retirer
                </Button>
                
                </form>

            </div>


        </div>
    )
}

export default Welcome;