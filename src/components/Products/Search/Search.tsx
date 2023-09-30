import { ProductsContextProvider } from "@/Contexts/ProductsContext";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useContext } from "react";

const Search = () => {
  const productContexts = useContext(ProductsContextProvider);
  return (
    <div
      className="
      search_container px-10 mt-5
      flex flex-wrap justify-start sm:justify-center
      gap-6"
    >
      <div className="w-[400px]">
        <TextField
          onChange={(e) => productContexts.setSearch(e.target.value)}
          label="Search"
          variant="standard"
          fullWidth
        />
      </div>

      <div className="w-[400px]">
        <FormControl fullWidth variant="standard">
          <InputLabel>Select From Categories</InputLabel>
          <Select
            onChange={(e) => productContexts.setCategory(e.target.value)}
            label="Select From Categories"
            value={productContexts?.category}
          >
            <MenuItem value="">
              <em>Select</em>
            </MenuItem>
            {productContexts.categories.map((category: any) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="w-[400px] flex flex-wrap gap-10">
        <div className="w-[180px]">
          <TextField
            onChange={(e) => productContexts.setFrom(e.target.value)}
            label="Search Price From"
            variant="standard"
            fullWidth
          />
        </div>
        <div className="w-[180px]">
          <TextField
            onChange={(e) => productContexts.setTo(e.target.value)}
            label="Search Price To"
            variant="standard"
            fullWidth
          />
        </div>
      </div>

      {/* <div className="w-fit flex gap-3 shadow-xl p-1">
        <p className="my-auto">توصيل مجاني</p>
        <input
          type="checkbox"
          className="my-auto"
          onChange={(e) => {
            if(productContexts.isfree){
              productContexts.setisfree('')
            }else{
              productContexts.setisfree(true)
            }
          }}
        />
      </div> */}
    </div>
  );
};

export default Search;
