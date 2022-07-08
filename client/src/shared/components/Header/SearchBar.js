import React from 'react'
import TextField from "@mui/material/TextField";

function SearchBar() {
  return (
    <div className='search_bar'>
        <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            label="Search"
        />
    </div>
  )
}

export default SearchBar