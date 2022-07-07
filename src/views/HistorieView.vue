<script setup lang="ts">
    import { MessageOrigin, type Message, useMessageStore } from "@/stores/message";
    import { Icon } from "@iconify/vue";
    import BaseButton from "@/components/BaseButton.vue";

    const { sentMessages, getTitle } = useMessageStore();

    function getColors(origin: MessageOrigin) {
        const colorStyles: Record<MessageOrigin, string> = {
            [MessageOrigin.System]: "border-sky-400 bg-sky-50",
            [MessageOrigin.Pilot]: "border-purple-400 bg-purple-50",
            [MessageOrigin.ThisATC]: "border-orange-400 bg-orange-50",
            [MessageOrigin.OtherATC]: "border-lime-400 bg-lime-50",
            [MessageOrigin.Error]: "border-red-400 bg-red-50",
        };

        return colorStyles[origin];
    }

    /**
     * get's the time with leading zeros an a slight difference for demonstration
     * @param count a number to randomize the shown time
     */
    function getTime(count:number){
        let timeString = "new"
        let hours = new Date().getHours()
        let minutes = new Date().getMinutes()-(7*count)

        // so we don't get negative minutes
        if(minutes < 0){
            minutes = 60 + minutes
            hours = hours - 1
        }

        // add the hours to the string
        timeString = hours + ' : '
        if(hours < 10){
            timeString = '0' + hours + ' : '
        }

        // add the minutes
        if(minutes < 10){
            timeString = timeString + '0' + minutes
        } else {
            timeString = timeString + minutes
        }

        return timeString
    }

</script>

<template>
    <main >
        <p class="h-10 p-3">
            new
            <BaseButton @click="() => $router.push('/')" class="absolute top-0 right-0"> 
                <Icon icon="fluent:history-dismiss-20-filled" class="h-10 w-10" /> 
            </BaseButton>
        </p> 
       
        <div v-for="message in sentMessages" :key="message.id" class="grid grid-cols-11 gap-3 place-content-stretch p-3 ">
            <div class="col-start-1 col-span-1"> 
                {{getTime(message.id)}}
            </div>
            <div class="col-start-2 col-span-5 border-2 rounded-md grid grid-cols-7 gap-1 place-items-center p-1" 
                :class="getColors(message.origin)">
                <p class="col-start-1 col-span-2"> {{message.planeId}}: </p>
                <p class="col-start-3 col-span-1"> {{ useMessageStore().getTitle(message.type) }} in </p>
                <p class="col-start-4 col-span-2"> {{message.zone}}</p>
                <div class="col-start-6 col-span-1  text-center px-3 border-x-2"
                    :class="getColors(message.origin)">
                    <p>A</p> 
                    <Icon v-if="message.acknowledgement === 'ATC' || message.acknowledgement === 'Both'" icon="uil:check" class="h-5 w-5 mx-auto" />
                    <Icon v-else icon="bxs:hourglass" class="h-5 w-5 mx-auto" />
                     <p>{{message.acknowledgementATC}}</p>
                </div>
                <p class="col-start-7 col-span-1 text-center px-3 border-x-2"
                    :class="getColors(message.origin)">
                    <p>P</p>  
                    <Icon v-if="message.acknowledgement === 'Pilot' || message.acknowledgement === 'Both'" icon="uil:check" class="h-5 w-5 mx-auto" />
                    <Icon v-else icon="bxs:hourglass" class="h-5 w-5 mx-auto" />
                    <p>{{message.acknowledgementPilot}}</p>
                </p>
            </div>
            <div class="col-start-7 col-span-5 border-2 rounded-md">
            </div>
        </div>
    </main>
</template>