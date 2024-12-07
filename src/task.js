import cron from 'node-cron'
import { AppContext } from './database/index.js'
import { TaskMethod } from './taskMethod.js'

// Objeto para armazenar tarefas ativas
const activeTasks = {}

// Função para carregar ou atualizar tarefas
export const tasks = async () => {
    try {

        console.log('Task: loading')

        const db = new AppContext()

        const tasks = await db.Task.findAll({attributes: ['id', 'methodId', 'schedule', 'arguments', 'status']})

        tasks.forEach((task) => {

            if (task.status == 'active') {

                if (activeTasks[task.id] && activeTasks[task.id]?.schedule != task.schedule) {

                    console.log(`Task: modifying - id: ${task.id} schedule: ${activeTasks[task.id]?.schedule}`)

                    activeTasks[task.id]['task'].stop()
                    delete activeTasks[task.id]
                }

                if (!activeTasks[task.id]) {

                    console.log(`Task: starting - id: ${task.id} schedule: ${task.schedule}`)

                    activeTasks[task.id] = {
                        schedule: task.schedule,
                        task: cron.schedule((task.schedule), async () => {
                            TaskMethod.execute(task)
                        }) 
                    }

                }

            } else if (activeTasks[task.id]) {
                console.log(`Task: disabling - id: ${task.id}`)
                activeTasks[task.id]['task'].stop()
                delete activeTasks[task.id]
            }

        })

        // Remove tarefas que não existem mais no banco
        Object.keys(activeTasks).forEach((taskId) => {
            if (!tasks.find((task) => task.id === taskId)) {
                console.log(`Task: disabling - id: ${taskId}`)
                activeTasks[taskId]['task'].stop()
                delete activeTasks[taskId]
            }
        })

    } catch (error) {
        console.error('Erro ao carregar tarefas do banco:', error)
    }
}