<template>
  <form style="width: 300px;">
    <header>
      <h1>{{title}}</h1>
    </header>
    <div class="row">
      <label><span>列数</span><input v-model="numColumns"></label>
      <label><span>セル数</span><input v-model="numCells"></label>
    </div>
    <footer>
      <button type="button" uxp-variant="secondary" @click="cancelFunction">キャンセル</button>
      <button type="submit" uxp-variant="primary" @click="closeFunction">決定</button>
    </footer>

  </form>
</template>

<script>
    export default {
        name: "panel",
        props: {
            dialog: {
                type:Object,
                required: true,
            },
            title:{
                type: String,
                default: "Hello, world"
            },
            columns: {
                type: Number,
                default: 1,
            },
            cells: {
                type: Number,
                default: 1,
            }
        },
        data: function () {

            return {
                numColumns:this.columns,
                numCells:this.cells
            }
        },

        methods: {
            cancelFunction: function () {
                this.dialog.close();
                this.$emit("close",null);

            },
            closeFunction: function() {
                this.dialog.close();
                this.$emit("close",{numColumns:this.numColumns, numCells: this.numCells});
            }
        }
    }
</script>

<style scoped>

</style>
