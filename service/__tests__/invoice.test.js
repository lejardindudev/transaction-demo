const invoiceService = require('../invoice/invoice.service');
const Invoice = require("../../models/Invoice")
jest.mock('../../models/Invoice',()=>({
    findOne: jest.fn(),
    create: jest.fn(),
}))

const mockUser1 = [
    {
        _id:"80b",
        name:"Bobby",
        email:"bubu@bobo.com",
        balance:1400,
    }
];
//TODO: verifier pourquoi le test 1 a besoin d'un tableau alors que le test 2 non
const mockNewOrder =
    [{
        _id:"680z",
        orderNumber:"680b",
        amount:50,
        userId:"80b",
    }]

let mockInvoiceCollection;




const mockSession = {content : "transaction's session content type"} 

// ######### Groupe de tests
describe("Test du service invoice",()=>{
    beforeEach(()=>{
        jest.resetAllMocks();
        // Réinitialise le mock de BDD
        mockInvoiceCollection = [
            {   
                invoiceNumber : "Inv-680b",
                orders : ["680f", "c4b4", '536'],
                totalAmount : 600,
                userId : "680b",
                save: jest.fn(),
            },
            {   
                invoiceNumber : "Inv-680z",
                orders : ["680a", "c4aa", '536a'],
                totalAmount : 850,
                userId : "680b",
            },
        ]
        
    })

    it("should create a new invoice and return succes message", async ()=>{
        // Mocks et implementations
        // Retour de findOne
        Invoice.findOne.mockResolvedValue(null);  
        // Implementation de create
        Invoice.create.mockImplementation((invoice,options) => {
            // const invoiceSingleArray = 
            //     {
            //         invoiceNumber : "Inv-"+ mockUser1[0]._id,
            //         orders: [mockNewOrder[0]._id] ,
            //         totalAmount : mockNewOrder[0].amount ,
            //         userId:mockUser1[0]._id,
            //     }
            
            mockInvoiceCollection.push(invoice[0]);
            return invoice;
        }); 
        

        // Execution du service testé
        const message = await invoiceService.findOrCreateInvoice(mockNewOrder,mockUser1,mockSession)  ;

        // Assertions 
        // TODO: deboguer ici

        expect(message).toEqual({status : "success" , message : "Invoice created or Updated"});


        expect(Invoice.create).toHaveBeenCalledWith(
           [{
                invoiceNumber : "Inv-"+ mockUser1[0]._id,
                orders: [mockNewOrder[0]._id] ,
                totalAmount : mockNewOrder[0].amount ,
                userId:mockUser1[0]._id,
            }],
            {session:mockSession},
        )

      
        // console.log("mocked database",mockInvoiceCollection);
        expect(mockInvoiceCollection).toEqual([
            {
              invoiceNumber: 'Inv-680b',
              orders: [ '680f', 'c4b4', '536' ],
              totalAmount: 600,
              userId: '680b',
              save: expect.any(Function),
            },
            {
              invoiceNumber: 'Inv-680z',
              orders: [ '680a', 'c4aa', '536a' ],
              totalAmount: 850,
              userId: '680b'
            },
            {
              invoiceNumber: 'Inv-80b',
              orders: [ '680z' ],
              totalAmount: 50,
              userId: '80b'
            }
          ])
        
    })

    it("should add an order to existing invoice", async ()=>{
     
        Invoice.findOne.mockResolvedValue(mockInvoiceCollection[0]);
      
        await invoiceService.findOrCreateInvoice(mockNewOrder,mockUser1,mockSession);

        expect(Invoice.findOne).toHaveBeenCalledWith(
            { userId: mockUser1[0]._id }, // Critères
            null, // Projection
            { session: mockSession } // Options
        );
        
        expect(mockInvoiceCollection[0]).toEqual(
            {   
                invoiceNumber : "Inv-680b",
                orders : ["680f", "c4b4", '536','680z'],
                totalAmount : 650,
                userId : "680b",
                save: expect.any(Function),
            }
        )

    })

    it("should throw catch error because findOne error", async ()=>{
        Invoice.findOne.mockRejectedValue({error : "Unable to reach database"});

        // const result = invoiceService.findOrCreateInvoice(mockNewOrder,mockUser1,mockSession);

        await expect(invoiceService.findOrCreateInvoice(mockNewOrder,mockUser1,mockSession)).rejects.toThrow("Database connection error");
    })


    

})