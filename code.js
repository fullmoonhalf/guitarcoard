var COARD = COARD || {};
COARD.engine = (function(){{
    var version = 0.00;
    var tag_class_note = "note";
    var tag_select_coard_root = "chord_root";
    var tag_select_coard_type = "chord_type";
    var tag_div_score_output = "note_score_output";
    var tag_div_tab_output = "note_tab_output";
    var symbol_invalid = "invalid";

    var pitch_name_list = [
        { octave: 0, pitch: 0, symbol: "C,", frets:[]},
        { octave: 0, pitch: 1, symbol: "^C,", frets:[]},
        { octave: 0, pitch: 2, symbol: "D,", frets:[]},
        { octave: 0, pitch: 3, symbol: "^D,", frets:[]},
        { octave: 0, pitch: 4, symbol: "E,", frets:[]},
        { octave: 0, pitch: 5, symbol: "F,", frets:[]},
        { octave: 0, pitch: 6, symbol: "^F,", frets:[]},
        { octave: 0, pitch: 7, symbol: "G,", frets:[]},
        { octave: 0, pitch: 8, symbol: "^G,", frets:[]},
        { octave: 0, pitch: 9, symbol: "A,", frets:[]},
        { octave: 0, pitch: 10, symbol: "^A,", frets:[]},
        { octave: 0, pitch: 11, symbol: "B,", frets:[]},
        { octave: 1, pitch: 0, symbol: "C", frets:[], name:{"sharp":"C","flat":"C",}},
        { octave: 1, pitch: 1, symbol: "^C", frets:[], name:{"sharp":"C#","flat":"Db",}},
        { octave: 1, pitch: 2, symbol: "D", frets:[], name:{"sharp":"D","flat":"D",}},
        { octave: 1, pitch: 3, symbol: "^D", frets:[], name:{"sharp":"D#","flat":"Eb",}},
        { octave: 1, pitch: 4, symbol: "E", frets:[], name:{"sharp":"E","flat":"E",}},
        { octave: 1, pitch: 5, symbol: "F", frets:[], name:{"sharp":"F","flat":"F",}},
        { octave: 1, pitch: 6, symbol: "^F", frets:[], name:{"sharp":"F#","flat":"Gb",}},
        { octave: 1, pitch: 7, symbol: "G", frets:[], name:{"sharp":"G","flat":"G",}},
        { octave: 1, pitch: 8, symbol: "^G", frets:[], name:{"sharp":"G#","flat":"Ab",}},
        { octave: 1, pitch: 9, symbol: "A", frets:[], name:{"sharp":"A","flat":"A",}},
        { octave: 1, pitch: 10, symbol: "^A", frets:[], name:{"sharp":"A#","flat":"Bb",}},
        { octave: 1, pitch: 11, symbol: "B", frets:[], name:{"sharp":"B","flat":"B",}},
        { octave: 2, pitch: 0, symbol: "c", frets:[]},
        { octave: 2, pitch: 1, symbol: "^c", frets:[]},
        { octave: 2, pitch: 2, symbol: "d", frets:[]},
        { octave: 2, pitch: 3, symbol: "^d", frets:[]},
        { octave: 2, pitch: 4, symbol: "e", frets:[]},
        { octave: 2, pitch: 5, symbol: "f", frets:[]}, 
        { octave: 2, pitch: 6, symbol: "^f", frets:[]},
        { octave: 2, pitch: 7, symbol: "g", frets:[]},
        { octave: 2, pitch: 8, symbol: "^g", frets:[]},
        { octave: 2, pitch: 9, symbol: "a", frets:[]},
        { octave: 2, pitch: 10, symbol: "^a", frets:[]},
        { octave: 2, pitch: 11, symbol: "b", frets:[]},
        { octave: 3, pitch: 0, symbol: "c'", frets:[]},
        { octave: 3, pitch: 1, symbol: "^c'", frets:[]},
        { octave: 3, pitch: 2, symbol: "d'", frets:[]},
        { octave: 3, pitch: 3, symbol: "^d'", frets:[]},
        { octave: 3, pitch: 4, symbol: "e'", frets:[]},
        { octave: 3, pitch: 5, symbol: "f'", frets:[]},
        { octave: 3, pitch: 6, symbol: "^f'", frets:[]},
        { octave: 3, pitch: 7, symbol: "g'", frets:[]},
        { octave: 3, pitch: 8, symbol: "^g'", frets:[]}, 
        { octave: 3, pitch: 9, symbol: "a'", frets:[]},
        { octave: 3, pitch: 10, symbol: "^a'", frets:[]},
        { octave: 3, pitch: 11, symbol: "b'", frets:[]},
        { octave: 4, pitch: 0, symbol: "c''", frets:[]},
        { octave: 4, pitch: 1, symbol: "^c''", frets:[]},
        { octave: 4, pitch: 2, symbol: "d''", frets:[]},
        { octave: 4, pitch: 3, symbol: "^d''", frets:[]},
        { octave: 4, pitch: 4, symbol: "e''", frets:[]},
    ];
    var default_guitar_tuning = [
        24+4,
        19+4, 
        15+4, 
        10+4, 
        5+4, 
        0+4, 
    ]
    var default_gutar_fret_count = 24;

    var coard_type_dictionary = {
        "major" : {structure: [0, 4, 7], symbol:"", },
        "major7" : {structure: [0, 4, 7, 11], symbol:"7", },
        "minor" : {structure: [0, 3, 7], symbol:"m", },
        "minor7" : {structure: [0, 3, 7, 10], symbol:"m7", },
        "sus4" : {structure: [0, 5, 7], symbol:"sus4", },
    };

    //
    // note
    //
    var Note = function(arg_element_coard_root, arg_element_coard_type, arg_element_score_output, arg_element_tab_output)
    {
        console.log(arg_element_coard_root, arg_element_coard_type, arg_element_score_output, arg_element_tab_output);
        this.ElementCoardRoot = arg_element_coard_root;
        this.ElementCoardType = arg_element_coard_type;
        this.ElementScoreOutput = arg_element_score_output;
        this.ElementTabOutput = arg_element_tab_output;
    }
    Note.prototype = 
    {
        init : function()
        {
            this.ElementCoardRoot.addEventListener("change", this);
            this.ElementCoardType.addEventListener("change", this);
        },

        handleEvent : function(event)
        {
            this.render();
        },

        render : function()
        {
            var valid = this.isValid();
            if(!valid)
            {
                return;
            }

            var code_root = this.ElementCoardRoot.value;
            var root_pitch_index = -1;
            var root_pitch = null;
            for(var pitch_index=0; pitch_index<pitch_name_list.length; ++pitch_index)
            {
                var pitch_search = pitch_name_list[pitch_index];
                if(pitch_search.pitch == code_root && pitch_search.octave == 1)
                {
                    root_pitch_index = pitch_index;
                    root_pitch = pitch_search;
                    break;
                }
            }
            if(root_pitch_index < 0)
            {
                return;
            }

            // 五線譜にスケール記述.
            var code_type_name = this.ElementCoardType.value;
            var code_type = coard_type_dictionary[code_type_name];
            var coard_index_list = []
            for(var structure_index=0; structure_index<code_type.structure.length; ++structure_index)
            {
                coard_index_list.push(root_pitch_index + code_type.structure[structure_index]);
            }

            var score = "X:1\n|";
            score = score + this.getCoardAbcMarkdown(coard_index_list);
            window.ABCJS.renderAbc(this.ElementScoreOutput, score);

            // タブ譜.
            var jtab_markdown = this.getCoardJtabMarkdown(root_pitch_index, code_type);
            var jtab_output = `<div class="jtab">${jtab_markdown}</div>`;
            this.ElementTabOutput.innerHTML = jtab_output;
            jtab.renderimplicit();
        },

        getCoardAbcMarkdown : function(pitch_list)
        {
            var markdown = "";

            if(pitch_list.length >= 2)
            {
                markdown = markdown + "[";
            }

            for(var index=0; index<pitch_list.length; ++index)
            {
                var pitch = pitch_name_list[pitch_list[index]];
                if(pitch.octave == 0)
                {
                    need_octave_separator = true;
                }
                markdown = markdown + pitch.symbol;
            }
            if(pitch_list.length >= 2)
            {
                markdown = markdown + "]";
            }
            markdown = markdown + "8 ";
            return markdown;
        },

        getCoardJtabMarkdown : function(root_pitch_index, code_type, code_name)
        {
            var root_pitch = pitch_name_list[root_pitch_index];
            var code_name =  String(root_pitch.name["sharp"])+String(code_type.symbol);
            var markdown = "$1.x | " + code_name + " | ";

            var guitar_tuning_list = default_guitar_tuning;


            var actual_structure = [];
            for(var structure_index = 0; structure_index<code_type.structure.length; ++structure_index)
            {
                for(var octave=0; ; ++octave)
                {
                    var shift = code_type.structure[structure_index] + octave * 12
                    var octave_pitch = root_pitch_index + shift;
                    if(octave_pitch < 0 )
                    {
                        continue;
                    }
                    if(octave_pitch >= pitch_name_list.length)
                    {
                        break;
                    }
                    actual_structure.push(shift);
                }
            }


            for(var string_index=guitar_tuning_list.length-1; string_index>=0; --string_index)
            {
                for(var pitch_index=0; pitch_index<pitch_name_list.length; ++pitch_index)
                {
                    var pitch_search = pitch_name_list[pitch_index];
                    if(pitch_search.pitch != root_pitch.pitch)
                    {
                        continue;
                    }
                    var root_fret = pitch_search.frets[string_index];
                    if(root_fret < 0)
                    {
                        continue;
                    }

                    //
                    var valid_pitch = 0;
                    var alternate_markdown = "";
                    for(var string_subindex=guitar_tuning_list.length-1; string_subindex>string_index; --string_subindex)
                    {
                        alternate_markdown = alternate_markdown + "X/.";
                    }
                    alternate_markdown = alternate_markdown + `${root_fret}/.`;
                    valid_pitch++;

                    // 他にないのか？
                    for(var string_subindex=string_index-1; string_subindex>=0; --string_subindex)
                    {
                        var alternate_fret = -1;
                        for(var structure_index = 0; structure_index<actual_structure.length; ++structure_index)
                        {
                            var structure_pitch_index = root_pitch_index + actual_structure[structure_index];
                            var structure_pitch = pitch_name_list[structure_pitch_index];
                            var structure_fret = structure_pitch.frets[string_subindex];
                            if(structure_fret < 0)
                            {
                                continue;
                            }
                            var distance = structure_fret - root_fret;
                            if(distance > 3 || distance < -1 )
                            {
                                continue;
                            }
                            alternate_fret = structure_fret;
                        }
                        var seperator = string_subindex == 0 ? "" : ".";
                        if(alternate_fret >= 0)
                        {
                            alternate_markdown = alternate_markdown + `${alternate_fret}/` + seperator;
                            valid_pitch++;
                        }
                        else
                        {
                            alternate_markdown = alternate_markdown + `X/` + seperator;
                        }
                    }
                    if(valid_pitch >= 4)
                    {
                        markdown += "%" + alternate_markdown + " ";
                    }
                }
            }

            return markdown;
        },

        isValid : function()
        {
            if(this.ElementCoardRoot.value == symbol_invalid)
            {
                return false;
            }
            if(this.ElementCoardType.value == symbol_invalid)
            {
                return false;
            }
            return true;
        }
    }


    //
    // engine
    //
    var engine = {
        init : function()
        {
            console.info("init - start", document, tag_class_note);

            var elements = document.getElementsByClassName(tag_class_note);
            for(var index=0; index<elements.length; ++index)
            {
                var element = elements[index];
                var element_coard_root = element.getElementsByTagName("select").namedItem(tag_select_coard_root);
                var element_coard_type = element.getElementsByTagName("select").namedItem(tag_select_coard_type);
                var element_score_output = element.getElementsByTagName("div").namedItem(tag_div_score_output);
                var element_tab_output = element.getElementsByTagName("div").namedItem(tag_div_tab_output);
                var note = new Note(element_coard_root, element_coard_type, element_score_output, element_tab_output);
                note.init();
            }

            var guitar_tuning_list = default_guitar_tuning;
            for(var pitch_index=0; pitch_index<pitch_name_list.length; ++pitch_index)
            {
                var pitch = pitch_name_list[pitch_index];
                for(var string_index=0; string_index<guitar_tuning_list.length; ++string_index)
                {
                    pitch.frets.push(-1);
                }
            }
            for(var string_index=0; string_index<guitar_tuning_list.length; ++string_index)
            {
                var fret = 0;
                var pitch_head = guitar_tuning_list[string_index];
                var pitch_tail = pitch_head + default_gutar_fret_count;
                for(var pitch_index=pitch_head; pitch_index<=pitch_tail; ++pitch_index, ++fret)
                {
                    var pitch = pitch_name_list[pitch_index];
                    pitch.frets[string_index] = fret;
                }
            }

            console.info(pitch_name_list);
            console.info("init - end");
        },
    };
    return engine;
}})();

(function(){
    if(document.readyState === "loading")
    {
        document.addEventListener("DOMContentLoaded", COARD.engine.init);
    }
    else
    {
        COARD.engine.init();
    }
})();