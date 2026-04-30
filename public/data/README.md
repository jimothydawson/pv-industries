# Australian Postcode Data

`australian-postcodes.json` is a compact lookup dataset used by the contact page custom quote form.

Source: `australian_postcodes_2025.csv` from IPTools, which credits Matthew Proctor's community sourced Australian postcode database.

The generated JSON filters out non-physical postal ranges, such as NSW `1000-1999` and other PO box/mail centre ranges, because this form asks for project locations.

Format: `[suburb, postcode, state]`
