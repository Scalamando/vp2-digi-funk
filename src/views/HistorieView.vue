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

</script>

<template>
    <main >
        <BaseButton @click="() => $router.push('/')"> 
            <Icon icon="fluent:history-dismiss-20-filled" class="h-10 w-10" /> 
        </BaseButton>
        <!--TODO: umändern in jedes Mal adden, wenn Freigabe gesendet mit Zeit-->
        <div v-for="message in sentMessages" :key="message.id" class="grid grid-cols-11 gap-3 place-content-stretch p-3 ">
            <div class="col-start-1 col-span-1"> 
                {{new Date().getHours()}} :  {{new Date().getMinutes()}}
            </div>
            <div class="col-start-2 col-span-5 border-2 rounded-md grid grid-cols-7 gap-1 place-items-center p-1" 
                :class="getColors(message.origin)">
                <p class="col-start-1 col-span-2"> {{message.planeId}}: </p>
                <p class="col-start-3 col-span-1"> {{ useMessageStore().getTitle(message.type) }} in </p>
                <p class="col-start-4 col-span-2"> {{message.zone}}</p>
                <p class="col-start-6 col-span-1  text-center px-3 border-x-2"
                    :class="getColors(message.origin)">
                    A 
                    <Icon v-if="message.acknowledgement === 'ATC' || message.acknowledgement === 'Both'" icon="uil:check" class="h-5 w-5" />
                    <Icon v-else icon="bxs:hourglass" class="h-5 w-5" />
                    {{message.acknowledgementATC}}
                </p>
                <p class="col-start-7 col-span-1 text-center px-3 border-x-2"
                    :class="getColors(message.origin)">
                    P 
                    <Icon v-if="message.acknowledgement === 'Pilot' || message.acknowledgement === 'Both'" icon="uil:check" class="h-5 w-5" />
                    <Icon v-else icon="bxs:hourglass" class="h-5 w-5" />
                    {{message.acknowledgementPilot}}
                </p>
            </div>
            <div class="col-start-7 col-span-5 border-2 rounded-md">
            </div>
        </div>
    </main>
</template>