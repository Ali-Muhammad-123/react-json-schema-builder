import * as react_jsx_runtime from 'react/jsx-runtime';

declare function SchemaBuilder({ setScehma, schema, }: {
    setScehma: (schema: any) => void;
    schema: any;
}): react_jsx_runtime.JSX.Element;

declare function useSchemaBuilder(schema: any): {
    tree: any;
    addNode: ({ path, childName }: {
        path: string[];
        childName: string;
    }) => void;
    editNode: ({ path, node }: {
        path: string[];
        node: any;
    }) => void;
    deleteNode: ({ path }: {
        path: string[];
    }) => void;
};

export { SchemaBuilder, useSchemaBuilder };
