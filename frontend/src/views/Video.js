import VideoPlayer from '@enact/sandstone/VideoPlayer';
import { useState, useEffect } from 'react';
import { MediaControls } from '@enact/sandstone/MediaPlayer';
import { useCpu, useMem } from '../hooks/configs';
import Button from '@enact/sandstone/Button';
import BodyText from '@enact/sandstone/BodyText';

const Video = (prop) => {
	const [statShow, setStatShow] = useState(false);
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
					setParsedData({
						...parsedData,
						idle: parseFloat(CPU.cpu.data.usage_idle).toFixed(2),
						irq: parseFloat(CPU.cpu.data.usage_softirq).toFixed(2),
						user: parseFloat(CPU.cpu.data.usage_user).toFixed(2),
						system: parseFloat(CPU.cpu.data.usage_system).toFixed(2)
					});
				}
			}
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
		}
	}, [data_mem]);

	const handleStatClick = () => {
		setStatShow(!statShow);
		console.log("toggle: " + statShow);
		if (statShow) {
			setData();
		}
	};

	function Status() {
		return (
			<>
				<BodyText>
					<BodyText>{`Mem_level: ${parsedData.level}`}</BodyText>
					<BodyText>{`Mem_available: ${parsedData.available}`}</BodyText>
					<BodyText>{`Mem_total: ${parsedData.total}`}</BodyText>
					<BodyText>{`Cpu_idle: ${parsedData.idle}`}</BodyText>
					<BodyText>{`Cpu_user: ${parsedData.user}`}</BodyText>
					<BodyText>{`Cpu_irq: ${parsedData.irq}`}</BodyText>
					<BodyText>{`Cpu_system: ${parsedData.system}`}</BodyText>
				</BodyText>
			</>
		);
	}

	return (
		<>
			<div>
				<Button icon="list" size="small" onClick={handleStatClick} />
			</div>
			<div
				style={{
					height: '70vh',
					transform: 'scale(1)',
					transformOrigin: 'top',
					width: '70vw',
					display: 'flex',
					justifyContent: 'center',
					margin: '0 auto'
				}}
			>
				<div>Sample code</div>
				<VideoPlayer
					autoCloseTimeout={7000}
					backButtonAriaLabel="go to previous"
					feedbackHideDelay={3000}
					initialJumpDelay={400}
					jumpDelay={200}
					loop
					miniFeedbackHideDelay={2000}
					muted
					title="Sandstone VideoPlayer Sample Video"
					titleHideDelay={4000}
				>
					<source src={prop.src} type="video/mp4" />
					<infoComponents>
						A video about some things happening to and around some characters.
						Very exciting stuff.
					</infoComponents>
					<MediaControls
						jumpBackwardIcon="jumpbackward"
						jumpForwardIcon="jumpforward"
						pauseIcon="pause"
						playIcon="play"
					>
						<Button icon="list" size="small" />
						<Button icon="playspeed" size="small" />
						<Button icon="speakercenter" size="small" />
						<Button icon="miniplayer" size="small" />
						<Button icon="subtitle" size="small" />
					</MediaControls>
				</VideoPlayer>
				<div style={{
					position: "absolute",
					top: '80px',
					left: '20px'
				}}>
					{statShow ? <Status /> : null}
				</div>
			</div>
		</>
	);
};

export default Video;
