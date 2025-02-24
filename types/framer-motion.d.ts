import { BoxProps, FlexProps } from '@chakra-ui/react';
import { HTMLMotionProps } from 'framer-motion';

export type MotionBoxProps = BoxProps & HTMLMotionProps<"div">;
export type MotionFlexProps = FlexProps & HTMLMotionProps<"div">; 