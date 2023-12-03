import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import Scroller from '@enact/sandstone/Scroller';
import $L from '@enact/i18n/$L';
import css from './Main.module.less';
import { useCpu, useMem } from '../hooks/configs';
import { useState, useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie'

const SysResponsivePie = ({ data }) => (
    <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.4}
        padAngle={1}
        activeOuterRadiusOffset={8}
        colors={{ scheme: 'nivo' }}
        borderWidth={1}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    0.2
                ]
            ]
        }}
        arcLinkLabelsTextColor="#ffffff"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    2
                ]
            ]
        }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'available'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'used'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'idle'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'system'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'user'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'irq'
                },
                id: 'lines'
            }
        ]}
        theme={{
            text: {
                fontSize: 30,
                fill: "#ffffff",
            },
            legends: {
                text: {
                    fontSize: 30,
                    fill: '#ffffff',
                },
            },
            annotations: {
                text: {
                    fontSize: 45,
                    fill: "#ffffff",
                }
            }
        }}
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 30,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 40,
                symbolShape: 'circle',
                text: [
                    {
                        fontSize: 100,
                        fill: "#ffffff",
                    }
                ],
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />
)

const Status = () => {
    const [data_cpu, setCpu] = useCpu({ returnValue: false });
    const [data_mem, setMem] = useMem({ returnValue: false });
    const [parsedData, setParsedData] = useState({
        level: '',
        available: '',
        total: '',
        idle: '',
        irq: '',
        user: '',
        system: ''
    });
    const [MemPieData, setMemPie] = useState(
        [
            {
                "id": "available",
                "label": "available",
                "value": 100,
                "color": "hsl(218, 70%, 50%)"
            },
            {
                "id": "used",
                "label": "used",
                "value": 0,
                "color": "hsl(253, 70%, 50%)"
            }
        ]
    );
    const [CpuPieData, setCpuPie] = useState(
        [
            {
                "id": "idle",
                "label": "idle",
                "value": 80,
                "color": "hsl(354, 70%, 50%)"
            },
            {
                "id": "system",
                "label": "system",
                "value": 10,
                "color": "hsl(255, 70%, 50%)"
            },
            {
                "id": "user",
                "label": "user",
                "value": 5,
                "color": "hsl(247, 70%, 50%)"
            },
            {
                "id": "irq",
                "label": "irq",
                "value": 5,
                "color": "hsl(253, 70%, 50%)"
            }
        ]
    );

    const setData = async () => {
        setCpu();
        setMem();
    }

    useEffect(() => {
        setData();
    }, []);

    useEffect(() => {
        if (data_cpu.returnValue) {
            for (let [id, CPU] of Object.entries(data_cpu.dataArray)) {
                if (CPU.cpu.cpu == "cpu-total") {
                    const _idle = parseFloat(CPU.cpu.data.usage_idle).toFixed(2);
                    const _irq = parseFloat(CPU.cpu.data.usage_softirq).toFixed(2);
                    const _user = parseFloat(CPU.cpu.data.usage_user).toFixed(2);
                    const _system = parseFloat(CPU.cpu.data.usage_system).toFixed(2);
                    setParsedData({
                        ...parsedData,
                        idle: _idle,
                        irq:_irq,
                        user: _user,
                        system: _system
                    });
                }
            }
            setCpuPie([
                {
                    "id": "idle",
                    "label": "idle",
                    "value": parsedData.idle,
                    "color": "hsl(354, 70%, 50%)"
                },
                {
                    "id": "system",
                    "label": "system",
                    "value": parsedData.system,
                    "color": "hsl(255, 70%, 50%)"
                },
                {
                    "id": "user",
                    "label": "user",
                    "value": parsedData.user,
                    "color": "hsl(247, 70%, 50%)"
                },
                {
                    "id": "irq",
                    "label": "irq",
                    "value": parsedData.irq,
                    "color": "hsl(253, 70%, 50%)"
                }
            ]);
        }
    }, [data_cpu]);

    useEffect(() => {
        if (data_mem.returnValue) {
            setParsedData({
                ...parsedData,
                level: data_mem.system.level,
                available: data_mem.system.available,
                total: data_mem.system.total
            });
            const used = parsedData.total - parsedData.available;
            setMemPie([
                {
                    "id": "available",
                    "label": "available",
                    "value": parsedData.available,
                    "color": "hsl(218, 70%, 50%)"
                },
                {
                    "id": "used",
                    "label": "used",
                    "value": used,
                    "color": "hsl(253, 70%, 50%)"
                }
            ]);
        }
    }, [data_mem]);

    return (
        <Scroller direction="verticle">
            <BodyText>{$L('This is a page for system status.')}</BodyText>
            {/* <BodyText>{`Cpu status : ${JSON.stringify(data_cpu)}`}</BodyText>
            <BodyText>{`Mem status: ${JSON.stringify(data_mem)}`}</BodyText> */}
            <div style={{
                position: "absolute",
                top: '40px',
                left: '80px',
                height: '600px',
                width: '600px'
            }}>
                <SysResponsivePie data={MemPieData}
                />
            </div>
            <div style={{
                position: "absolute",
                top: '40px',
                left: '700px',
                height: '600px',
                width: '600px'
            }}>
                <SysResponsivePie data={CpuPieData}
                />
            </div>
            <div style={{
                position: "absolute",
                top: '700px',
                left: '40px'
            }}>
                <BodyText>{`Mem_level: ${parsedData.level}`}</BodyText>
                <BodyText>{`Mem_available: ${parsedData.available}`}</BodyText>
                <BodyText>{`Mem_total: ${parsedData.total}`}</BodyText>
            </div>
            <div style={{
                position: "absolute",
                top: '700px',
                left: '700px'
            }}>
                <BodyText>{`Cpu_idle: ${parsedData.idle}`}</BodyText>
                <BodyText>{`Cpu_irq: ${parsedData.irq}`}</BodyText>
                <BodyText>{`Cpu_user: ${parsedData.user}`}</BodyText>
                <BodyText>{`Cpu_system: ${parsedData.system}`}</BodyText>
            </div>
            <div style={{
                position: "absolute",
                top: '600px',
                left: '1300px'
            }}>
                {<Button onClick={setData} size="small" className={css.buttonCell}>
                    {$L('Refresh')}
                </Button>}
            </div>
        </Scroller>
    );
};

export default Status;