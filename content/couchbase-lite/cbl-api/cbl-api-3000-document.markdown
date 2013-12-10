# Document Resources

Document resources enable you to work with individual documents in a database. The following table lists the document resources:

|HTTP method | URI pattern | Description  |
| ------	| ------	| ------	|  
| `POST`    | `/{db}`                     | Creates a new document in the database  
| `GET`| `/{db}/{doc}` | Retrieves a specific document |
|  `HEAD`| `/{db}/{doc}` | Retrieves only the headers for the document
|  `PUT`| `/{db}/{doc}` |Updates a specific document|  
| `DELETE`| `/{db}/{doc}` | Deletes a specific document |  
| `GET` | `/{db}/{doc}/{attachment}`| Retrieves the attachments for a specific document|
| `PUT` | `/{db}/{doc}/{attachment}`| Updates the attachments for a specific document|
| `DELETE` | `/{db}/{doc}/{attachment}`| Deletes the attachments for a specific document|


The following table defines the parameters used in the path templates:

| Name | Description|  
|  ------	| ------	|  
| attachment | Identifier of an attachment |  
| db | Name of the database|  
| doc | Identifier of a document


## POST /{db}


## GET /{db}/{doc}

## HEAD /{db}/{doc}

## PUT /{db}/{doc}

## DELETE /{db}/{doc}
## GET /{db}/{doc}/{attachment}

## PUT /{db}/{doc}/{attachment}
## DELETE /{db}/{doc}/{attachment}


