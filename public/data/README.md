# Australian Postcode Data

`australian-postcodes.json` is a compact lookup dataset used by the contact page custom quote form.

`australian-suburbs-geocoded.json` is a compact lookup dataset used by the quote calculator suburb/postcode checker. It includes coordinates so the calculator can route locations more than 60km from Bankstown to the tailored quote flow.

Sources:

- `australian-postcodes.json`: generated from `australian_postcodes_2025.csv` from IPTools, which credits Matthew Proctor's community sourced Australian postcode database.
- `australian-suburbs-geocoded.json`: generated from a geocoded Australian postcode CSV derived from the public `randomecho/australian-postcodes` dataset.

The generated JSON filters out non-physical postal ranges, such as NSW `1000-1999` and other PO box/mail centre ranges, because this form asks for project locations.

Formats:

- `australian-postcodes.json`: `[suburb, postcode, state]`
- `australian-suburbs-geocoded.json`: `[suburb, postcode, state, latitude, longitude]`
