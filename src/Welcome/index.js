import React from 'react'
import './.css';

import { Button, TextField, ListItemSecondaryAction } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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

    tableRow: {
        "&$selected, &$selected:hover": {
          backgroundColor: "#E8E8E8"
        }
      },
    hover: {},
    selected: {}
    
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
    const [debutH, setDebutH] = useState("00:00");
    const [finH, setFinH] = useState("00:00");
    const [poste, setPoste] = useState(0);
    const [selectedDate, setSelectedDate] = React.useState(Date.now); // Si on souhaite récupérer cette valeur (Data.now) faire 
                                                                      //  amj.format(...).toString() 
    const [id, setId] = useState('');                                                                  

    // >> Variables lorsque le poste n'est pas conforme ---------------------------                                                                      
    const [btnAjouter, setBtnAjouter] = useState(false);
    const [labelPoste, setLabelPoste] = useState("Poste");
    const [helperTextPoste, sethelperTextPoste] = useState(null);
    const [couleur, setCouleur] = useState('black');    

    const [open, setOpen] = React.useState(false);
    const handleClose = () => { setOpen(false) };

    // Récupère l'index de la ligne du tableau quand celle-ci est cliqué.
    const [selectedIndex, setSelectedIndex] = useState(null);
 


    // Fonctions -----------------------------------------------------------------------------------------

    // Gestion de l'envoie du formulaire pour l'ajout d'une attribution -------------------------------
    const onUpdate = e => {
        e.preventDefault()
        const db = firebase.db;

        attributionPossible()

        // db.collection('Attribution').add({
        //     utilisateur: utilisateur,
        //     poste: poste,
        //     date: amj.format(selectedDate).toString(),
        //     // heure: heure
        // })
    }

    const attributionPossible = () => {

        const _date = amj.format(selectedDate).toString() 
        //setSelectedIndex(3)

        
        // if(attr.map((item) => ( 
        //     item.poste == poste && item.date == _date && 
        //     (item.heure.split(" - ")[0] < finH && item.heure.split(" - ")[1] > debutH) )))
        //     setId(atr)
        //     setOpen(true)
        //     }
        //     console.log(item.id)
        // ))

        // attr.some(item => item.poste == poste && item.date == _date && 
        //     (item.heure.split(" - ")[0] < finH && item.heure.split(" - ")[1] > debutH) )){
        //         setOpen(true)
        // }
    }

    const creneauxConforme = () => { return debutH > finH ? false : true }  // Vérifie si la date de fin n'est pas postérieur à la date de début. 
    const postConforme     = () => { if(poste < 0){ setPoste(0) } }         // Vérieifie si l'admin n'a pas entré un numéro de poste négatif.


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

    const selectRow = (i) => {

        // const index = e.target.parentElement.getAttribute('data_key')
        const index = i

        setSelectedIndex(index)
        setUtilisateur(attr[index].utilisateur)
        setPoste(attr[index].poste)
        setId(attr[index].id)

        const sd = attr[index].date.split("/")                // On doit transformé la format de la date qui est en fr en us
        const usDate = sd[1] + "/" + sd[0] + "/" + sd[2]
        setSelectedDate(Date.parse(usDate));                  // Puis on transformé cette date en format timestamps

        const splitHeure = attr[index].heure.split(" - ")    
        setDebutH(splitHeure[0])
        setFinH(splitHeure[1])

    }


    // Conformité du poste ----------------------------------------------------------
    React.useEffect(() => {

        postConforme()

    //     const posteDispo = () => {

    //         if(poste<0 || attr.some(item => item.poste == poste)){ // Si le poste est supérieur à 0 ou que c'est un nombre 
    //                                                                //  qui n'est pas déjà dans la base.
    //             setBtnAjouter(true)
    //             setLabelPoste("Erreur")
    //             setCouleur("red")
    //             sethelperTextPoste("Valeur non conforme ou poste déjà prit")

    //         } else {

    //             setBtnAjouter(false)
    //             setLabelPoste("Poste")
    //             setCouleur("black")
    //             sethelperTextPoste(null)
    //         }
    //     };
    //     posteDispo()        
    })

    // ==============================================================================================================================

  

    return(

        <div className="row" >

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
                            <TableRow
                            hover
                            key={index} data_key={index} onClick={ () => {selectRow(index)}}
                            selected={selectedIndex === index}
                            classes={{ hover: classes.hover, selected: classes.selected }}
                            className={classes.tableRow}>
                            <TableCell> {_attr.id} </TableCell>                              
                            <TableCell align="right"> {_attr.utilisateur} </TableCell>      
                            <TableCell align="right"> {_attr.poste} </TableCell>
                            <TableCell align="right"> {_attr.date} </TableCell>
                            <TableCell align="right"> {_attr.heure} </TableCell>
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

                    <div id = "time">

                        <p id="creneaux" > Crénaux </p>

                    {/* Début ------------------------------------------------------------- */}
                    <TextField
                        id="tfTime"
                        onChange={ e => setDebutH(e.target.value) }
                        value={debutH}
                        required
                        label="Début"
                        type="time"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />

                    {/* Fin ----------------------------------------------------------------- */}
                    <TextField
                        id="tfTime"
                        onChange={ e => setFinH(e.target.value) }
                        required
                        value={finH}
                        label="Fin"
                        type="time"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />

                    </div>

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

                    <div>

                    {/* Bouton ajouter ------------------------------------------------------------------------- */}
                    <Button 
                        id="btnAM"
                        disabled={btnAjouter}
                        type="submit"
                        fullWidth
                        variant="contained"
                    >
                        Ajouter
                    </Button>

                    <Button 
                        id="btnAM"
                        disabled={btnAjouter}
                        type="submit"
                        fullWidth
                        variant="contained"
                    >
                        Modifier
                    </Button>

                    </div>

                </form>

            </div>

            {/* Suppression d'une attribution ---------------------------------------------------------------- */}
            
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
                
                {/* Bouton Suppression --------------------------------------------------------- */}
                <Button 
                    type="submit"
                    fullWidth
                    variant="contained"
                >
                    Retirer
                </Button>

                </form>

            </div>

        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Let Google help apps determine location. This means sending anonymous location data to
                Google, even when no apps are running.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Les poste est déjà prit par {id}
                </Button>
                <Button onClick={handleClose} color="primary" autoFocus>
                    Agree
                </Button>
            </DialogActions>
      </Dialog>

        </div>
    )
}

export default Welcome;