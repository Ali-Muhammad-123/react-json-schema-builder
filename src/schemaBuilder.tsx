import { MenuItem, Select, ThemeProvider } from "@mui/material";
import styles from "./schema-builder.module.scss";
import useSchemaBuilder from "./useSchemaBuilder";
import { useEffect, useState } from "react";
import theme from "./theme";

const componentClassPrefix = "add-operation";
const dropdownIcon = () => (
  <i className={`fa-solid fa-chevron-down af-single-select__icon`}></i>
);
export default function SchemaBuilder({
  setScehma,
  schema,
}: {
  setScehma: (schema: any) => void;
  schema: any;
}) {
  const { tree, addNode, editNode, deleteNode } = useSchemaBuilder(schema);

  useEffect(() => {
    setScehma(tree);
  }, [tree]);

  function Field({
    fieldName,
    field,
    path,
    index,
    showDelete = true,
  }: {
    fieldName: string | null;
    field: any;
    path: string[];
    index: number;
    showDelete?: boolean;
  }) {
    const [name, setName] = useState(fieldName);
    const [type, setType] = useState(field.type);
    return (
      <div className={styles[`${componentClassPrefix}__field`]}>
        <div
          className={`${styles[`${componentClassPrefix}__field-header`]} ${
            styles[`${componentClassPrefix}__field-header--active`]
          }`}
        >
          <div className={styles[`${componentClassPrefix}__field-header-left`]}>
            {name !== null && (
              <div
                className={`input-group overlayed ${
                  styles[`${componentClassPrefix}__field-title`]
                }`}
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => {
                    //  setName(fieldName)
                  }}
                  value={name}
                />
                <div className="input-group-text">
                  <button
                    onClick={(e) => {
                      editNode({ path, node: { name } });
                    }}
                    className={`btn btn-icon-transparent btn-s-24`}
                  >
                    <i className="fa-solid fa-check"></i>
                  </button>
                  <button
                    onClick={() => setName(fieldName)}
                    className={`btn btn-icon-transparent btn-s-24`}
                  >
                    <i className="fa-solid fa-close"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
          <div
            className={styles[`${componentClassPrefix}__field-header-right`]}
          >
            <div>
              {path.length !== 1 && (
                <Select
                  MenuProps={{
                    PaperProps: {
                      className: "af-single-select__dd",
                    },
                  }}
                  value={field.type}
                  IconComponent={dropdownIcon}
                  displayEmpty={true}
                  onChange={(e) => {
                    editNode({ path, node: { type: e.target.value } });
                  }}
                >
                  <MenuItem value={""}>Select</MenuItem>
                  <MenuItem value={"string"}>String</MenuItem>
                  <MenuItem value={"number"}>Number</MenuItem>
                  <MenuItem value={"object"}>Object</MenuItem>
                  <MenuItem value={"array"}>Array</MenuItem>
                </Select>
              )}
            </div>
            {(field.type == "object" || field.type == "array") && (
              <button
                className="btn btn-icon-transparent btn-s-32"
                onClick={() => {
                  addNode({
                    path,
                    childName: `Child ${
                      field.properties || field.items.properties
                        ? Object.entries(
                            field.properties || field.items.properties
                          ).length + 1
                        : 1
                    }`,
                  });
                }}
              >
                <i className="fa-solid fa-add"></i>
              </button>
            )}
            {path.length !== 1 && showDelete && (
              <button
                className="btn btn-icon-transparent btn-s-32"
                onClick={() => {
                  deleteNode({ path });
                }}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            )}
          </div>
        </div>
        <div className={styles[`${componentClassPrefix}__field-body`]}>
          {/* { field.type == 'object' || field.type == 'array' ? */}
          {field?.properties || field?.items ? (
            Array.isArray(field.items) ? (
              field.items.map((arrayItem: any, index: number) => (
                <Field
                  key={`${fieldName}${index}`}
                  fieldName={null}
                  field={arrayItem}
                  path={[...path, "items", `${index}`]}
                  index={Object.entries(arrayItem).length}
                />
              ))
            ) : field.items ? (
              <Field
                fieldName={null}
                field={field.items}
                path={[...path, "items"]}
                index={Object.entries(field.items).length ?? 0}
                showDelete={false}
              />
            ) : (
              Object.entries(field.properties).map((el, index) => {
                return (
                  <Field
                    key={`${fieldName}${el[0]}${index}`}
                    fieldName={el[0]}
                    field={el[1]}
                    path={[...path, "properties", el[0]]}
                    index={
                      Object.entries(field.properties || field.items.properties)
                        .length ?? 0
                    }
                  />
                );
              })
            )
          ) : (
            <></>
          )}
          {/* : <></> */}
        </div>
      </div>
    );
  }
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
        crossOrigin="anonymous"
      />
      <ThemeProvider theme={theme}>
        <Field
          fieldName={Object.keys(tree)[1]}
          field={Object.values(tree)[1]}
          path={[Object.keys(tree)[1]]}
          // @ts-ignore
          index={Object.entries(Object.values(tree)[1].properties).length}
        />
      </ThemeProvider>
    </>
  );
}
