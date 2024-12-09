

//## Mocks de fonctions et de données
// Mock du modele Order

const { updateUserBalance } = require("../user/balance.service");

// Mock de session
const mockSession = {session : "transaction's session content type"}

// Mock Database
const mockNewOrders =[
    {
        _id:"680z",
        orderNumber:"680z",
        amount:50,
        userId:"80b"
    },
    {
        _id:"680a",
        orderNumber:"680a",
        amount:-50,
        userId:"80b"
    },
    {
        _id:"999z",
        orderNumber:"999z",
        amount:50,
        userId:"80z"
    },
]

let mockUsers;

describe('test de service updateBalance',()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
        mockUsers = [
            {
                _id:"80b",
                name:"Bobby",
                email:"bubu@bobo.com",
                balance:1400,
                save:jest.fn(),
            },
            undefined,
            {
                name:"Simone",
                email:"simone@simone.com",
                balance:3700,
            },
        ];

    })
    it("should update userBalance to 1350",async()=>{

        const result = await updateUserBalance([mockUsers[0]],[mockNewOrders[0]],mockSession);
        // Assertions (returned result, session sent to save, amount of balance)
        expect(result).toEqual({
            status:"success",
            message : "user : Bobby, balance updated to 1350"
        });
        expect(mockUsers[0].save).toHaveBeenCalledWith({session : mockSession});
        expect(mockUsers[0].balance).toBe(1350);
    })
    it("should throw error message cause of negative amount",async()=>{
        await expect(updateUserBalance([mockUsers[0]],[mockNewOrders[1]],mockSession)).rejects.toThrow("Unable to decrement balance with negative amount")
        expect(mockUsers[0].balance).toBe(1400);
    })
    it("should throw error message cause of non matching userId in order",async()=>{
        await expect(updateUserBalance([mockUsers[0]],[mockNewOrders[2]],mockSession)).rejects.toThrow("UserId conflict :order should come from same user, ")
        expect(mockUsers[0].balance).toBe(1400);
    })
    it ("should throw internal error, save sending reject",async ()=>{
        mockUsers[0].save.mockRejectedValue(new Error("unable to save document"));
        await expect(updateUserBalance([mockUsers[0]],[mockNewOrders[0]],mockSession)).rejects.toThrow("unable to save document")
    })


})