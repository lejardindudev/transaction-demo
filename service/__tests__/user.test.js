//## Instanciation des ressources
const User = require('../../models/User');
const {findOrCreateUser} = require("../../service/user/user.service");

//## Mock de fonctions et datas
// Mock model User
jest.mock("../../models/User",()=>({
    findOne : jest.fn(),
    create:jest.fn(),
}));
// Mock données
let mockUsers;
const mockSession = {session : "transaction's session content type"}
describe("Test du service findOrCreateUser",()=>{
   beforeEach(()=>{
        jest.resetAllMocks();
        mockUsers = [
            {
                _id:"80b",
                name:"Bobby",
                email:"bubu@bobo.com",
                balance:1400,
            },
            undefined,
            {
                email:"simone@simone.com",
                balance:3700,
            }, 
        ] 
        // User.findOne.mockImplementation((filter,projection,options)=>{
        //     const foundUser = mockUsers.find((user)=>{
        //         return user?.name === filter.name && user?.email === filter.email
        //     })
        //     return foundUser;
        // });
        User.findOne.mockImplementation(async (filter,projection,options)=>{
            const foundUser = mockUsers.find((user)=>{
                return user?.name === filter.name && user?.email === filter.email
            })
            return Promise.resolve(foundUser);
        });
        User.create.mockImplementation(async(datas,options)=>{
            const createdUser = {
                _id:"generatedId",
                name:datas[0].name,
                email:datas[0].email,
                balance : 2000,
            }
            mockUsers.push(createdUser);
            return [createdUser];
        })
   })
    
    it("should send a user found message",async ()=>{
        const result = await findOrCreateUser("bubu@bobo.com","Bobby",mockSession);
        expect(result).toEqual(
             [{
                _id:"80b",
                name:"Bobby",
                email:"bubu@bobo.com",
                balance:1400,
            }]
        )

    })
    it("should send created message because neither name or email match with mockUsers",async ()=>{
        
        const result = await findOrCreateUser("bobof@bobof.com","Bobof",mockSession);
        expect(result).toEqual(
            [{
                _id:"generatedId",
                name:"Bobof",
                email:"bobof@bobof.com",
                balance:2000,
            }]
        )
        expect (mockUsers).toEqual([
            {
                _id:"80b",
                name:"Bobby",
                email:"bubu@bobo.com",
                balance:1400,
            },
            undefined,
            {
                email:"simone@simone.com",
                balance:3700,
            }, 
            {
                _id:"generatedId",
                name:"Bobof",
                email:"bobof@bobof.com",
                balance:2000,
            }
        ] )
    })

    it("should send created message because name match with mockUsers but email not",async ()=>{
        // console.log("databaseUsers",mockUsers)
        const result = await findOrCreateUser("bobof@bobof.com","Bobby",mockSession);
        expect(result).toEqual(
            [{
                _id:"generatedId",
                name:"Bobby",
                email:"bobof@bobof.com",
                balance:2000,
            }]
        )
    })

    it("should send created message because neither name or email match with mockUsers",async ()=>{
        const result = await findOrCreateUser("bobof@bobof.com","Bobof",mockSession);
        expect(result).toEqual(
            [{
                _id:"generatedId",
                name:"Bobof",
                email:"bobof@bobof.com",
                balance:2000,
            }]
        )
    })
    it('should throw Error because findOne rejects',async ()=>{
        User.findOne.mockRejectedValue(new Error("Fail to join database"));
        await expect(findOrCreateUser("bobof@bobof.com","Bobof",mockSession)).rejects.toThrow("Fail to join database");
    })
    it('should throw Error because create rejects',async ()=>{
        User.create.mockRejectedValue(new Error("Fail to createUser"));
        await expect(findOrCreateUser("bobof@bobof.com","Bobof",mockSession)).rejects.toThrow("Fail to createUser");
    })
})



