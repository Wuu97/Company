"use client";
import { useState } from "react";
import { TextField, TextareaField } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import styles from "./routes.module.css";
const presets = ["20GP", "40GP", "40HQ", "45HQ", "双小柜"];
export function ContainerTags({ name, initial = [] }: { name: string; initial?: string[] }) {
 const [selected, setSelected] = useState<string[]>(initial.length ? initial : presets);
 return <fieldset className={styles.tagField}><legend>适用柜型</legend><input type="hidden" name={name} value={selected.join(",")} /><div className={styles.tagOptions}>{presets.map(value => <button type="button" aria-pressed={selected.includes(value)} key={value} onClick={() => setSelected(values => values.includes(value) ? values.filter(item => item !== value) : [...values, value])}>{value}</button>)}</div></fieldset>;
}

export function CountedNote({ initial = "" }: { initial?: string }) {
 const [note, setNote] = useState(initial);
 return <div className={styles.fullField}><TextareaField label="备注" name="note" rows={2} maxLength={200} value={note} onChange={e => setNote(e.target.value)} /><div className={styles.counter}>{note.length}/200</div></div>;
}
export function UnitInput({ label, name, unit, prefix, required, initial = "" }: { label: string; name: string; unit: string; prefix?: string; required?: boolean; initial?: string }) {
 return <div className={styles.unitInput}><TextField label={label} name={name} type="number" min="0" step="0.01" required={required} defaultValue={initial} /><span className={styles.unitSuffix}>{unit}</span>{prefix && <span className={styles.unitPrefix}>{prefix}</span>}</div>;
}
export function RouteNodes({ value }: { value: { origin?: string; destination?: string; viaPoints?: string | null } }) {
 const [origin, setOrigin] = useState(value.origin || ""), [destination, setDestination] = useState(value.destination || ""), [via, setVia] = useState<string[]>(value.viaPoints?.split("-").filter(Boolean) || []);
 const nodes = [origin, ...via, destination].map(v => v.trim()).filter(Boolean);
 return <div className={styles.nodeRow}><TextField label="起点" name="origin" required maxLength={120} value={origin} onChange={e => setOrigin(e.target.value)} />{via.map((node, index) => <div className={styles.viaNode} key={index}><TextField label={`途经点 ${index + 1}`} name="viaPoint" required maxLength={120} value={node} onChange={e => setVia(values => values.map((v, i) => i === index ? e.target.value : v))} /><button type="button" aria-label={`删除途经点 ${index + 1}`} onClick={() => setVia(values => values.filter((_, i) => i !== index))}>×</button></div>)}<span className={styles.nodeArrow} aria-hidden="true">→</span><TextField label="终点" name="destination" required maxLength={120} value={destination} onChange={e => setDestination(e.target.value)} /><button className={styles.addVia} type="button" onClick={() => setVia(values => [...values, ""])}>＋途经</button><input type="hidden" name="name" value={nodes.join("-")} /></div>;
}
