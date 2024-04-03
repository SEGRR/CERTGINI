import { MenuItem, TextField, InputAdornment, IconButton, Slider, Box } from '@mui/material'
import { React, useState } from 'react'
import AdsClickIcon from '@mui/icons-material/AdsClick';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import FontFormatSelector from './ToogleButton';
import '../assets/style.css'
import { StandardFonts } from 'pdf-lib';
export default function Paarameter({ index, positionOf, handlePositioning, param, removePosition, handleFontFamily, handleFontSize, handleFontStyle, handleName }) {

    // let fontFamily  = [
    //     {
    //         value:'Sans-serif',
    //         label:'Sans-serif'
    //     },
    //     {
    //         value:'Arial',
    //         label:'Arial'
    //     }
    // ]

    return (
        <div className='param'>
            <TextField size='small' value={param.name} onChange={(e) => handleName(e, index)} required label="Name" variant="outlined" />
            <div className='style-container'>

                <p>Styling</p>
                <FontFormatSelector index={index} format={param.fontStyle} handleFontStyle={handleFontStyle} />
                <div className="location">
                    <Box>

                        <TextField
                            select
                            label="Font Style"
                            // defaultValue={'TimesRoman'}
                            value={param.fontFamily}
                            onChange={(e) => handleFontFamily(e, index)}

                        >

                            {Object.keys(StandardFonts).map((key) => (
                                <MenuItem key={key} value={key}>
                                    {StandardFonts[key]}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <TextField
                        label="FontSize"
                        id="outlined-start-adornment"
                        type='number'
                        size='small'
                        value={param.fontSize}
                        onChange={(e) => handleFontSize(e, index)}
                        sx={{ m: 1, width: '10ch' }}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">px</InputAdornment>,
                        }}
                    />

                </div>
            </div>
            <p>Select position</p>

            <div className='location'>
                <TextField size='small' value={param.x} readOnly required label="X" variant="outlined" />
                <TextField size='small' value={param.y} readOnly required label="Y" variant="outlined" />
                {param.x == '' && param.y == '' ?

                    <IconButton color={index == positionOf ? 'secondary' : 'default'} aria-label="click" onClick={() => handlePositioning(index)}>
                        <AdsClickIcon />
                    </IconButton>
                    :
                    <IconButton color='error' aria-label="click" onClick={() => removePosition(index)}>
                        <RemoveCircleIcon />
                    </IconButton>
                }
            </div>

        </div>
    )
}
