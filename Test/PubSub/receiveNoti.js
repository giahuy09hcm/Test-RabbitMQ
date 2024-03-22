const amqplib = require('amqplib')
const amqp_url_cloud = 'amqps://bobadfbe:mwAOAPi0JIr9RhMukVvJ5RBMY-OqcoTm@armadillo.rmq.cloudamqp.com/bobadfbe'
const amqp_url_docker = 'amqp://localhost:5672'
const receiveNoti = async () => {
    try {
        const conn = await amqplib.connect(amqp_url_docker)
        const channel = await conn.createChannel()
        const nameExchange = 'video'
        await channel.assertExchange(nameExchange,'fanout',{
            durable: false //=true thi khi restart lai ko bi mat message (luu y khi set true thi set luon cho consumer)
        })
        const{
            queue
        }=await channel.assertQueue('',{
            exclusive: true //=true xoa hang doi sau khi stop consumer
        })
        console.log(`nameQueue:::: ${queue}`)
        await channel.bindQueue(queue,nameExchange,'')
        await channel.consume(queue,msg =>{
            console.log('Msg::::', msg.content.toString())
        },{
            noAck: true // =true thi se ngung gui message khi da xac nhan duoc co consumer nhan duoc message do =false se gui den tat ca consumer
        })
    
    } catch (error) {
        console.error('Error::',error.message)
    }
}

receiveNoti()