/**
 * Copyright (C) 2012-2015 KO GmbH <copyright@kogmbh.com>
 *
 * @licstart
 * This file is part of ViewerJS.
 *
 * ViewerJS is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License (GNU AGPL)
 * as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * ViewerJS is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with ViewerJS.  If not, see <http://www.gnu.org/licenses/>.
 * @licend
 *
 * @source: http://viewerjs.org/
 * @source: http://github.com/kogmbh/ViewerJS
 */

/*global runtime, core*/

/**
 * tool used in build process.
 *
 * this tool reads argv[1] and writes it to argv[2]
 * after replacing every occurance of argv[2n+1] with
 * the contents of the file argv[2n+2]
 * (for n>0)
 *
 */

function run(input_file, output_file, keywords) {
    "use strict";
    var repl_done, inp_data;
    try {
        inp_data = runtime.readFileSync(input_file, "utf-8");
    } catch (err) {
        runtime.log("failed to read input_file \"" + input_file + "\":");
        runtime.log(err);
        return;
    }

    repl_done = [];
    keywords.forEach(function (trans) {
        if ((trans.from && trans.input)) {
            runtime.log("replacing [" + trans.from + "-" + trans.to + "] with contents of [" + trans.input + "].");
            runtime.readFile(trans.input, "utf-8", function (err, repl_data) {
                if (err) {
                    runtime.log(err);
                    return;
                }
                // "function() { return repl_data; }" is used to avoid possible replacement patterns in repl_data, e.g. $&
                inp_data = inp_data.replace(new RegExp(trans.from+"[\\s\\S]*"+trans.to, "gm"), function() { return repl_data; });

                repl_done.push(trans);
                if (repl_done.length === keywords.length) {
                    runtime.writeFile(output_file, inp_data, function (err) {
                        if (err) {
                            runtime.log(err);
                            return;
                        }
                    });
                }
            });
        } else {
            runtime.log("skipping replacement: [" + trans.from + "-" + trans.to + "] / [" + trans.input + "]");
        }

    });
}

var i, input_file, output_file, keywords = [];
i = 1;
input_file = arguments[i];
i += 1;
output_file = arguments[i];
i += 1;

for (; i + 1 < arguments.length; i += 3) {
    keywords.push({
        from: arguments[i],
        to: arguments[i + 1],
        input: arguments[i + 2]
    });
}
runtime.log("filtering [" + input_file + "] to [" + output_file + "]");
run(input_file, output_file, keywords);
